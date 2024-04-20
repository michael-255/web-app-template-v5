import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { DBTableEnum, DurationEnum, DurationMSEnum, SettingIdEnum, TagEnum } from '@/shared/enums'
import { exampleResultSchema, exampleSchema, logSchema, settingSchema } from '@/shared/schemas'
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
    [DBTableEnum.SETTINGS]!: Table<Setting>;
    [DBTableEnum.LOGS]!: Table<Log>;
    [DBTableEnum.EXAMPLES]!: Table<Example>;
    [DBTableEnum.EXAMPLE_RESULTS]!: Table<ExampleResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [DBTableEnum.SETTINGS]: '&id',
            [DBTableEnum.LOGS]: '&id, createdAt',
            [DBTableEnum.EXAMPLES]: '&id, name, *tags',
            [DBTableEnum.EXAMPLE_RESULTS]: '&id, parentId, createdAt',
        })

        // Required for converting objects to classes
        this[DBTableEnum.SETTINGS].mapToClass(Setting)
        this[DBTableEnum.LOGS].mapToClass(Log)
        this[DBTableEnum.EXAMPLES].mapToClass(Example)
        this[DBTableEnum.EXAMPLE_RESULTS].mapToClass(ExampleResult)
    }
}

export class DatabaseApi {
    constructor(private dbt: DatabaseTables) {}

    //
    // Utilities
    //

    /**
     * Returns the label for a table in singular or plural form.
     */
    getTableLabel(table: DBTableEnum, style: 'singular' | 'plural' = 'singular') {
        switch (table) {
            case DBTableEnum.SETTINGS:
                return style === 'singular' ? 'Setting' : 'Settings'
            case DBTableEnum.LOGS:
                return style === 'singular' ? 'Log' : 'Logs'
            case DBTableEnum.EXAMPLES:
                return style === 'singular' ? 'Example' : 'Examples'
            case DBTableEnum.EXAMPLE_RESULTS:
                return style === 'singular' ? 'Example Result' : 'Example Results'
            default:
                throw new Error(`Table ${table} was not found`)
        }
    }

    /**
     * Returns the parent table for a child table or an error if the table has no parent.
     */
    getParentTable(table: DBTableEnum) {
        switch (table) {
            case DBTableEnum.EXAMPLE_RESULTS:
                return DBTableEnum.EXAMPLES
            default:
                throw new Error(`Table ${table} has no parent table`)
        }
    }

    /**
     * Returns the child table for a parent table or an error if the table has no child.
     */
    getChildTable(table: DBTableEnum) {
        switch (table) {
            case DBTableEnum.EXAMPLES:
                return DBTableEnum.EXAMPLE_RESULTS
            default:
                throw new Error(`Table ${table} has no child table`)
        }
    }

    /**
     * Uses schema parse function to ensure all fields pass validation and removes any extra fields
     * that are not in the model schema.
     */
    modelSchemaParse(table: DBTableEnum, model: DBRecordType): DBRecordType {
        switch (table) {
            case DBTableEnum.SETTINGS:
                return settingSchema.parse(model)
            case DBTableEnum.LOGS:
                return logSchema.parse(model)
            case DBTableEnum.EXAMPLES:
                return exampleSchema.parse(model)
            case DBTableEnum.EXAMPLE_RESULTS:
                return exampleResultSchema.parse(model)
            default:
                throw new Error('Cannot parse unknown model type')
        }
    }

    //
    // Internal
    //

    /**
     * Wrapper compacts Dexie transaction using reasonable defaults.
     * @param tables Array of tables to include in transaction
     * @param callback Async anonymous function to execute within transaction
     */
    private async transaction(tables: DBTableEnum[], callback: () => Promise<void>) {
        const dbTables = tables.map((table) => this.dbt.table(table)) as [Dexie.Table<any, any>]
        return await this.dbt.transaction('rw', ...dbTables, callback)
    }

    /**
     * Updates lastChild field of parent record with last child record of child table.
     * @param table Child table to get last child record from
     * @param parentId Parent record id to update lastChild field
     */
    private async updateLastChild(table: DBTableEnum, parentId: IdType) {
        this._notSupportedTableGuard(table, [
            DBTableEnum.SETTINGS,
            DBTableEnum.LOGS,
            DBTableEnum.EXAMPLES,
        ])
        const lastChild = (
            await this.dbt.table(table).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
            .reverse()[0]
        const parentTable = this.getParentTable(table)
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
        table: DBTableEnum,
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
            case DBTableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [DBTableEnum.EXAMPLES, DBTableEnum.EXAMPLE_RESULTS],
                    async () => {
                        await this.dbt.table(table).bulkAdd(validRecords)
                        await this.updateLastChild(
                            this.getParentTable(table),
                            validRecords[0].parentId,
                        )
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
    private _notSupportedTableGuard(table: DBTableEnum, notSupported: DBTableEnum[] = []) {
        notSupported.push('' as any, undefined as any, null as any) // Default unsupported values
        if (notSupported.includes(table)) {
            throw new Error(`Unsupported table: ${table}`)
        }
    }

    /**
     * Guard against missing records.
     */
    private _recordMissingGuard(table: DBTableEnum, id: IdType, record?: DBRecordType) {
        if (!record) {
            throw new Error(`Record not found on table ${table} with id ${id}`)
        }
    }

    //
    // Settings
    //

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async initSettings() {
        const defaultSettings: Readonly<{
            [key in SettingIdEnum]: SettingValueType
        }> = {
            [SettingIdEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingIdEnum.CONSOLE_LOGS]: false,
            [SettingIdEnum.INFO_MESSAGES]: true,
            [SettingIdEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingIds = Object.values(SettingIdEnum)

        const settings = await Promise.all(
            settingIds.map(async (id) => {
                const setting = await this.dbt.settings.get(id)

                if (setting) {
                    return setting
                } else {
                    return { id, value: defaultSettings[id] }
                }
            }),
        )

        await Promise.all(settings.map((s) => this.dbt.settings.put(new Setting(s.id, s.value))))
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
            await this.dbt.settings.get(SettingIdEnum.LOG_RETENTION_DURATION)
        )?.value as DurationEnum

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const allLogs = await this.dbt.logs.toArray()
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

        await this.dbt.logs.bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    //
    // Live Queries
    //

    /**
     * Live query settings with no explicit sorting.
     */
    liveSettings() {
        return liveQuery(() => this.dbt.settings.toArray())
    }

    /**
     * Live query logs sorted by createdAt date in descending order.
     */
    liveLogs() {
        return liveQuery(() => this.dbt.logs.orderBy('createdAt').reverse().toArray())
    }

    /**
     * Live query examples sorted alphabetically by name.
     */
    liveExamples() {
        return liveQuery(() => this.dbt.examples.orderBy('name').toArray())
    }

    /**
     * Live query example results sorted by createdAt date in descending order.
     */
    liveExampleResults() {
        return liveQuery(() => this.dbt['example-results'].orderBy('createdAt').reverse().toArray())
    }

    /**
     * Live query records for a parent table. This will filter out records that are not enabled and
     * sort them alphabetically by name. If a record is favorited, it will be sorted to the top of
     * the list.
     */
    liveDashboardTable(parentTable: DBTableEnum) {
        this._notSupportedTableGuard(parentTable, [
            DBTableEnum.SETTINGS,
            DBTableEnum.LOGS,
            DBTableEnum.EXAMPLE_RESULTS,
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
    // Core CRUD Methods
    //

    /**
     * Gets a record from the database. This will throw an error if the record is not found or if
     * the provided table is not supported.
     */
    async getRecord(table: DBTableEnum, id: IdType): Promise<DBRecordType> {
        this._notSupportedTableGuard(table, [DBTableEnum.SETTINGS])
        const recordToGet = await this.dbt.table(table).get(id)
        this._recordMissingGuard(table, id, recordToGet)
        return recordToGet!
    }

    /**
     * Adds a record to the database. This will also update the last child field of the parent
     * record when adding a child record.
     */
    async addRecord(table: DBTableEnum, model: DBRecordType): Promise<DBRecordType> {
        const parsedModel = this.modelSchemaParse(table, model)

        switch (table) {
            case DBTableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [DBTableEnum.EXAMPLES, DBTableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Create child record
                        await this.dbt['example-results'].add(parsedModel as ExampleResult)
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
    async putRecord(table: DBTableEnum, model: DBRecordType): Promise<DBRecordType> {
        const parsedModel = this.modelSchemaParse(table, model)

        switch (table) {
            case DBTableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [DBTableEnum.EXAMPLES, DBTableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Put child record
                        await this.dbt['example-results'].put(parsedModel as ExampleResult)
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
    async deleteRecord(table: DBTableEnum, id: IdType): Promise<DBRecordType> {
        const recordToDelete = await this.dbt.table(table).get(id)

        switch (table) {
            case DBTableEnum.EXAMPLES:
                await this.transaction(
                    [DBTableEnum.EXAMPLES, DBTableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Delete parent record
                        await this.dbt.examples.delete(id)
                        // Delete associated child records
                        await this.dbt['example-results'].where('parentId').equals(id).delete()
                    },
                )
                break
            case DBTableEnum.EXAMPLE_RESULTS:
                await this.transaction(
                    [DBTableEnum.EXAMPLES, DBTableEnum.EXAMPLE_RESULTS],
                    async () => {
                        // Delete child record
                        await this.dbt['example-results'].delete(id)
                        // Update parent record last child
                        await this.updateLastChild(table, recordToDelete.parentId)
                    },
                )
                break
            default:
                throw new Error(`Table ${table} does not support deleteRecord()`)
        }

        return recordToDelete
    }

    //
    // Miscellaneous
    //

    /**
     * Toggles the FAVORITED tag on the model's tags property.
     */
    async toggleFavorite(table: DBTableEnum, model: DBRecordType) {
        if ('tags' in model) {
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
     * Convenience method to get parent id options for child tables in frontend components.
     */
    async getParentIdOptions(table: DBTableEnum) {
        const records = await this.dbt.table(this.getParentTable(table)).orderBy('name').toArray()
        return records.map((r: DBRecordType) => ({
            value: r.id as IdType,
            label: `${r.name} (${truncateText(r.id, 8, '*')})`,
            disable: r.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }

    //
    // Database
    //

    /**
     * Imports and schema parses the data from a backup object. This will not import logs.
     */
    async importData(backupData: BackupDataType) {
        // Import settings first in case errors stop type importing below
        const backupSettings = backupData[DBTableEnum.SETTINGS]
        if (backupSettings.length > 0) {
            await Promise.all(
                backupSettings
                    .filter((setting) =>
                        Object.values(SettingIdEnum).includes(setting.id as SettingIdEnum),
                    )
                    .map(
                        async (setting) =>
                            await this.putRecord(
                                DBTableEnum.SETTINGS,
                                new Setting(setting.id, setting.value),
                            ),
                    ),
            )
        }

        await Promise.all([
            this.processTableImport(
                DBTableEnum.EXAMPLES,
                backupData[DBTableEnum.EXAMPLES],
                exampleSchema,
            ),
            this.processTableImport(
                DBTableEnum.EXAMPLE_RESULTS,
                backupData[DBTableEnum.EXAMPLE_RESULTS],
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
            [DBTableEnum.SETTINGS]: await this.dbt.settings.toArray(),
            [DBTableEnum.LOGS]: await this.dbt.logs.toArray(),
            [DBTableEnum.EXAMPLES]: this.cleanRecords(
                await this.dbt.examples.toArray(),
            ) as Example[],
            [DBTableEnum.EXAMPLE_RESULTS]: this.cleanRecords(
                await this.dbt['example-results'].toArray(),
            ) as ExampleResult[],
        }
        return backupData
    }

    /**
     * Clears all data from a table in the database.
     */
    async clearTable(table: DBTableEnum) {
        switch (table) {
            case DBTableEnum.SETTINGS:
                await this.dbt.settings.clear()
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
            Object.values(DBTableEnum).map(async (table) => await this.clearTable(table)),
        ])
    }

    /**
     * Deletes entire database. Require app reload to reinitialize the database.
     */
    async deleteDatabase() {
        return await this.dbt.delete()
    }
}

/**
 * Preconfigured instance of Database for the application
 */
export default new DatabaseApi(new DatabaseTables(`${appName} v${appDatabaseVersion}`))
