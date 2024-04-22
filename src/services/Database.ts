import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { appDatabaseVersion, appName } from '@/shared/constants'
import {
    extractTableFromId,
    getParentTable,
    getTableGroup,
    modelSchemaParse,
} from '@/shared/db-utils'
import {
    DurationEnum,
    DurationMSEnum,
    GroupEnum,
    SettingIdEnum,
    TableEnum,
    TagEnum,
} from '@/shared/enums'
import { exampleResultSchema, exampleSchema } from '@/shared/schemas'
import {
    type BackupDataType,
    type DBRecordType,
    type IdType,
    type SettingValueType,
} from '@/shared/types'
import { truncateText } from '@/shared/utils'
import Dexie, { liveQuery, type Table } from 'dexie'
import type { z } from 'zod'

export class DatabaseTables extends Dexie {
    // Required for easier TypeScript usage
    [TableEnum.SETTINGS]!: Table<Setting>;
    [TableEnum.LOGS]!: Table<Log>;
    [TableEnum.EXAMPLES]!: Table<Example>;
    [TableEnum.EXAMPLE_RESULTS]!: Table<ExampleResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [TableEnum.SETTINGS]: '&id',
            [TableEnum.LOGS]: '&id, createdAt',
            [TableEnum.EXAMPLES]: '&id, name, *tags',
            [TableEnum.EXAMPLE_RESULTS]: '&id, createdAt, parentId',
        })

        // Required for converting objects to classes
        this[TableEnum.SETTINGS].mapToClass(Setting)
        this[TableEnum.LOGS].mapToClass(Log)
        this[TableEnum.EXAMPLES].mapToClass(Example)
        this[TableEnum.EXAMPLE_RESULTS].mapToClass(ExampleResult)
    }
}

export class DatabaseApi {
    constructor(private dbt: DatabaseTables) {}

    //
    // Internal
    //

    /**
     * Wrapper compacts Dexie transaction using reasonable defaults.
     * @param tables Array of tables to include in transaction
     * @param callback Async anonymous function to execute within transaction
     */
    private async transaction(tables: TableEnum[], callback: () => Promise<void>) {
        const dbTables = tables.map((table) => this.dbt.table(table)) as [Dexie.Table<any, any>]
        return await this.dbt.transaction('rw', ...dbTables, callback)
    }

    /**
     * Updates lastChild field of parent record with last child record of child table.
     * @param table Child table to get last child record from
     * @param parentId Parent record id to update lastChild field
     */
    private async updateLastChild(table: TableEnum, parentId: IdType) {
        this._notSupportedTableGuard(table, [
            TableEnum.SETTINGS,
            TableEnum.LOGS,
            TableEnum.EXAMPLES,
        ])
        const lastChild = (
            await this.dbt.table(table).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
            .reverse()[0]
        const parentTable = getParentTable(table)
        await this.dbt.table(parentTable).update(parentId, { lastChild })
    }

    /**
     * Remove data and fields that are not needed for storing the data as a backup.
     * @param records DBRecordType[]
     */
    private cleanRecords(records: DBRecordType[]) {
        return records.map((r) => {
            if ('tags' in r) {
                r.tags = r.tags.filter((tag: TagEnum) => tag !== TagEnum.LOCKED)
            }
            if ('lastChild' in r) {
                delete r.lastChild
            }
            return r
        })
    }

    /**
     * Process table import with validation and parent record updates.
     */
    private async processTableImport(
        table: TableEnum,
        records: DBRecordType[],
        schema: z.ZodObject<any, any, any> | z.ZodEffects<any, any, any>,
    ) {
        const validRecords: DBRecordType[] = []
        const skippedRecords: DBRecordType[] = []

        records.forEach((r) => {
            if (schema.safeParse(r).success) {
                validRecords.push(schema.parse(r))
            } else {
                skippedRecords.push(r)
            }
        })

        // Add additional table processing here
        switch (table) {
            case TableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [TableEnum.EXAMPLES, TableEnum.EXAMPLE_RESULTS],
                    async () => {
                        await this.dbt.table(table).bulkAdd(validRecords)
                        await this.updateLastChild(getParentTable(table), validRecords[0].parentId)
                    },
                )
                break
            default:
                await this.dbt.table(table).bulkAdd(validRecords)
                break
        }

        if (skippedRecords.length > 0) {
            throw new Error(
                `Records skipped due to validation failures (${
                    skippedRecords.length
                }): ${skippedRecords.map((r) => String(r.id))}`,
            )
        }
    }

    //
    // Guards
    //

    /**
     * Guard against unsupported tables.
     */
    private _notSupportedTableGuard(table: TableEnum, notSupported: TableEnum[] = []) {
        notSupported.push('' as any, undefined as any, null as any) // Default unsupported values
        if (notSupported.includes(table)) {
            throw new Error(`Unsupported table: ${table}`)
        }
    }

    /**
     * Guard against missing records.
     */
    private _recordMissingGuard(id: IdType, record?: DBRecordType) {
        if (!record) {
            throw new Error(`Record not found: ${id}`)
        }
    }

    //
    // Settings
    //

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async initSettings() {
        const defaultSettings: {
            [key in SettingIdEnum]: SettingValueType
        } = {
            [SettingIdEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingIdEnum.CONSOLE_LOGS]: false,
            [SettingIdEnum.INFO_MESSAGES]: true,
            [SettingIdEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingids = Object.values(SettingIdEnum)

        const settings = await Promise.all(
            settingids.map(async (id) => {
                const setting = await this.dbt.table(TableEnum.SETTINGS).get(id)
                if (setting) {
                    return setting
                } else {
                    return { id, value: defaultSettings[id] }
                }
            }),
        )

        await Promise.all(
            settings.map((s) => this.dbt.table(TableEnum.SETTINGS).put(new Setting(s.id, s.value))),
        )
        return settings
    }

    //
    // Logs
    //

    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    async purgeLogs() {
        const logRetentionDuration = (
            await this.dbt.table(TableEnum.SETTINGS).get(SettingIdEnum.LOG_RETENTION_DURATION)
        )?.value as DurationEnum

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const allLogs = await this.dbt.table(TableEnum.LOGS).toArray()
        const maxLogAgeMs = DurationMSEnum[logRetentionDuration]
        const now = Date.now()

        // Find Logs that are older than the retention time and map them to their keys
        const removableLogs = allLogs
            .filter((log: Log) => {
                const logTimestamp = log.createdAt ?? 0
                const logAge = now - logTimestamp
                return logAge > maxLogAgeMs
            })
            .map((log: Log) => log.id) // Map remaining Log ids for removal

        await this.dbt.table(TableEnum.LOGS).bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    //
    // Live Queries
    //

    /**
     * Standard live query returns all records in the table with ordering based on the table type.
     */
    liveTable(table: TableEnum) {
        return liveQuery(() => this.getAll(table))
    }

    /**
     * Live query records for a parent table. This will filter out records that are not enabled and
     * sort them alphabetically by name. If a record is favorited, it will be sorted to the top of
     * the list.
     */
    liveDashboardTable(parentTable: TableEnum) {
        this._notSupportedTableGuard(parentTable, [
            TableEnum.SETTINGS,
            TableEnum.LOGS,
            TableEnum.EXAMPLE_RESULTS,
        ])
        return liveQuery(() =>
            this.dbt
                .table(parentTable)
                .orderBy('name')
                .filter((r) => r.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((records) =>
                    records.sort((a, b) => {
                        const aIsFavorited = a.tags.includes(TagEnum.FAVORITED)
                        const bIsFavorited = b.tags.includes(TagEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        } else if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        } else {
                            // If both or neither are favorited, sort alphabetically by name
                            return a.name.localeCompare(b.name)
                        }
                    }),
                ),
        )
    }

    //
    // Standard Gets
    //

    /**
     * Gets all records from a table.
     */
    async getAll(table: TableEnum) {
        switch (table) {
            case TableEnum.SETTINGS:
                return await this.dbt.table(TableEnum.SETTINGS).toArray()
            case TableEnum.LOGS:
                return await this.dbt.table(TableEnum.LOGS).orderBy('createdAt').reverse().toArray()
            case TableEnum.EXAMPLES:
                return await this.dbt.table(TableEnum.EXAMPLES).orderBy('name').toArray()
            case TableEnum.EXAMPLE_RESULTS:
                return await this.dbt
                    .table(TableEnum.EXAMPLE_RESULTS)
                    .orderBy('createdAt')
                    .reverse()
                    .toArray()
            default:
                throw new Error(`Table ${table} not supported`)
        }
    }

    //
    // Core CRUD Methods
    //

    /**
     * Gets a record from the database. Throws an error if the record is not found.
     */
    async getRecord(id: IdType): Promise<DBRecordType> {
        const table = extractTableFromId(id)
        const recordToGet = await this.dbt.table(table).get(id)
        this._recordMissingGuard(id, recordToGet)
        return recordToGet!
    }

    /**
     * Adds a record to the database. This will also update the last child field of the parent
     * record when adding a child record.
     */
    async addRecord(model: DBRecordType): Promise<DBRecordType> {
        const parsedModel = modelSchemaParse(model)
        const table = extractTableFromId(parsedModel.id)

        switch (table) {
            case TableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [TableEnum.EXAMPLES, TableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Create child record
                        await this.dbt
                            .table(TableEnum.EXAMPLE_RESULTS)
                            .add(parsedModel as ExampleResult)
                        // Update parent record last child
                        await this.updateLastChild(table, parsedModel.parentId)
                    },
                )
                break
            default:
                await this.dbt.table(table).add(parsedModel)
                break
        }

        return parsedModel
    }

    /**
     * Puts a record into the database. This will update an existing record or create a new one if
     * the record does not exist. This will also update the last child field of the parent record
     * when putting a child record.
     */
    async putRecord(model: DBRecordType): Promise<DBRecordType> {
        const parsedModel = modelSchemaParse(model)
        const table = extractTableFromId(parsedModel.id)

        switch (table) {
            case TableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [TableEnum.EXAMPLES, TableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Put child record
                        await this.dbt
                            .table(TableEnum.EXAMPLE_RESULTS)
                            .put(parsedModel as ExampleResult)
                        // Update parent record last child
                        await this.updateLastChild(table, parsedModel.parentId)
                    },
                )
                break
            default:
                await this.dbt.table(table).put(parsedModel)
                break
        }

        return parsedModel
    }

    /**
     * Deletes a record from the database. This will also delete any associated child records when
     * deleting a parent record and update the last child field of the parent record when deleting a
     * child record.
     */
    async deleteRecord(id: IdType): Promise<DBRecordType> {
        const table = extractTableFromId(id)
        const recordToDelete = await this.dbt.table(table).get(id)
        this._recordMissingGuard(id, recordToDelete)

        switch (table) {
            case TableEnum.EXAMPLES:
                await this.transaction(
                    [TableEnum.EXAMPLES, TableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Delete parent record
                        await this.dbt.table(TableEnum.EXAMPLES).delete(id)
                        // Delete associated child records
                        await this.dbt
                            .table(TableEnum.EXAMPLE_RESULTS)
                            .where('parentId')
                            .equals(id)
                            .delete()
                    },
                )
                break
            case TableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [TableEnum.EXAMPLES, TableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Delete child record
                        await this.dbt.table(TableEnum.EXAMPLE_RESULTS).delete(id)
                        // Update parent record last child
                        await this.updateLastChild(table, recordToDelete.parentId)
                    },
                )
                break
            default:
                throw new Error(`Table ${table} not supported`)
        }

        return recordToDelete
    }

    //
    // Miscellaneous
    //

    /**
     * Toggles the FAVORITED tag on the model's tags property.
     */
    async toggleFavorite(model: DBRecordType) {
        if ('tags' in model) {
            const table = extractTableFromId(model.id)
            const index = model.tags.indexOf(TagEnum.FAVORITED)
            if (index === -1) {
                model.tags.push(TagEnum.FAVORITED)
            } else {
                model.tags.splice(index, 1)
            }
            await this.dbt.table(table).update(model.id, { tags: model.tags })
        } else {
            throw new Error('Cannot toggle favorite on model without tags property')
        }
    }

    /**
     * Generates table options for select box components on the frontend.
     */
    async getTableOptions(table: TableEnum) {
        const group = getTableGroup(table)
        const records = await this.getAll(table)

        switch (group) {
            case GroupEnum.PARENT:
                return records.map((r: DBRecordType) => ({
                    value: r.id as IdType,
                    label: `${r.name} (${truncateText(r.id, 8, '*')})`,
                    disable: r.tags.includes(TagEnum.LOCKED) as boolean,
                }))
            case GroupEnum.CHILD:
                return records.map((r: DBRecordType) => ({
                    value: r.id as IdType,
                    label: `${truncateText(r.id, 8, '*')} (${truncateText(r.parentId, 8, '*')})`,
                    disable: r.tags.includes(TagEnum.LOCKED) as boolean,
                }))
            default:
                // Standalone - Don't expect to be using this much
                return records.map((r: DBRecordType) => ({
                    value: r.id as IdType,
                    label: r.id as IdType,
                    disable: false,
                }))
        }
    }

    //
    // Database
    //

    /**
     * Imports and schema parses the data from a backup object. This will not import logs.
     */
    async importData(backupData: BackupDataType) {
        // Import settings first in case errors stop type importing below
        const backupSettings = backupData[TableEnum.SETTINGS]
        if (backupSettings.length > 0) {
            await Promise.all(
                backupSettings
                    .filter((setting) =>
                        Object.values(SettingIdEnum).includes(setting.id as SettingIdEnum),
                    )
                    .map(
                        async (setting) =>
                            await this.putRecord(new Setting(setting.id, setting.value)),
                    ),
            )
        }

        await Promise.all([
            this.processTableImport(
                TableEnum.EXAMPLES,
                backupData[TableEnum.EXAMPLES],
                exampleSchema,
            ),
            this.processTableImport(
                TableEnum.EXAMPLE_RESULTS,
                backupData[TableEnum.EXAMPLE_RESULTS],
                exampleResultSchema,
            ),
        ])
    }

    /**
     * Collects all data from the database and returns it as a backup object. This process also
     * removes any data that is not needed for storing the data as a backup.
     */
    async exportData() {
        const backupData: BackupDataType = {
            appName: appName,
            databaseVersion: appDatabaseVersion,
            createdAt: Date.now(),
            [TableEnum.SETTINGS]: await this.getAll(TableEnum.SETTINGS),
            [TableEnum.LOGS]: await this.getAll(TableEnum.LOGS),
            [TableEnum.EXAMPLES]: this.cleanRecords(
                await this.getAll(TableEnum.EXAMPLES),
            ) as Example[],
            [TableEnum.EXAMPLE_RESULTS]: this.cleanRecords(
                await this.getAll(TableEnum.EXAMPLE_RESULTS),
            ) as ExampleResult[],
        }
        return backupData
    }

    /**
     * Clears all data from a table in the database.
     */
    async clearTable(table: TableEnum) {
        switch (table) {
            case TableEnum.SETTINGS:
                await this.dbt.table(TableEnum.SETTINGS).clear()
                return await this.initSettings()
            default:
                return await this.dbt.table(table).clear()
        }
    }

    /**
     * Clears all data from the database.
     */
    async clearAppData() {
        await Promise.all([
            Object.values(TableEnum).map(async (table) => await this.clearTable(table)),
        ])
    }

    /**
     * Deletes entire database. Require app reload to reinitialize the database.
     */
    async deleteDatabase() {
        return await this.dbt.delete()
    }

    //
    // Testing
    //

    /**
     * @TODO Remove this method after testing is complete.
     */
    async testRecords() {
        // Example
        const example = new Example()
        example.desc =
            'This is an Example description. These descriptions can be quite long and detailed at 250 characters. Here is my attempt fill this space with text that makes sense. I want to see what this looks like when you are at the limit. This is enough.'
        example.tags = [TagEnum.ENABLED]
        // Example Result
        const exampleResult = new ExampleResult(example.id)
        exampleResult.note =
            'This is the Example Result note. It has a limit of 250 characters just like the description.'
        exampleResult.tags = [TagEnum.SKIPPED]
        // Pairing Updates
        example.lastChild = exampleResult
        // DB Creates
        await this.addRecord(example)
        console.log('Test Example added', example)
        await this.addRecord(exampleResult)
        console.log('Test Example Result added', exampleResult)
    }
}

/**
 * Preconfigured instance of Database for the application
 */
export default new DatabaseApi(new DatabaseTables(`${appName} v${appDatabaseVersion}`))
