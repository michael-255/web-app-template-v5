import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Setting from '@/models/Setting'
import type { Database } from '@/services/Database'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { SettingIdEnum, TableEnum, TagEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import type { BackupDataType, DBRecordType, IdType } from '@/shared/types'
import type { z } from 'zod'

/**
 * @TODO
 */
export default class DatabaseService {
    /**
     * @TODO
     */
    static getService(tableOrId: TableEnum | IdType) {
        let table = tableOrId

        if (idSchema.safeParse(tableOrId).success) {
            // Extract Table from Id prefix
            table = tableOrId.substring(0, 3) as TableEnum
        }

        switch (table) {
            case TableEnum.SETTINGS:
                return SettingService
            case TableEnum.LOGS:
                return LogService
            case TableEnum.EXAMPLES:
                return ExampleService
            case TableEnum.EXAMPLE_RESULTS:
                return ExampleResultService
            default:
                throw new Error(`No Service found for Table/Id ${tableOrId}`)
        }
    }

    /**
     * Process table import with validation and parent record updates.
     */
    private static async _processTableImport(
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

    /**
     * Imports and schema parses the data from a backup object. This will not import logs.
     */
    static async import(db: Database, backupData: BackupDataType) {
        const backupSettings = backupData[TableEnum.SETTINGS]

        if (backupSettings.length > 0) {
            const settingIds = Object.values(SettingIdEnum)
            // Only use backup Settings that are in the SettingIdEnum (ignore invalid Settings)
            const settings = backupSettings.filter((s) => settingIds.includes(s.id))
            // Schema parse the backup Settings (fails on bad Settings)
            settings.map((s) => SettingService.schema.parse(s))
            // Update app Settings with backup Settings
            await Promise.all(
                settings.map((s) =>
                    SettingService.put(db, new Setting({ id: s.id, value: s.value })),
                ),
            )
        }

        await Promise.all([
            this._processTableImport(
                TableEnum.EXAMPLES,
                backupData[TableEnum.EXAMPLES],
                exampleSchema,
            ),
            this._processTableImport(
                TableEnum.EXAMPLE_RESULTS,
                backupData[TableEnum.EXAMPLE_RESULTS],
                exampleResultSchema,
            ),
        ])

        return true // TODO
    }

    /**
     * Remove data and fields that are not needed for storing the data as a backup.
     */
    private static _cleanRecords<T extends DBRecordType>(records: T[]) {
        return records.map((r) => {
            // TODO: Not exporting records that are locked???
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
     * @TODO
     */
    static async export(db: Database) {
        const backupData: BackupDataType = {
            appName: appName,
            databaseVersion: appDatabaseVersion,
            createdAt: Date.now(),
            [TableEnum.SETTINGS]: await SettingService.getAll(db),
            [TableEnum.LOGS]: await LogService.getAll(db),
            [TableEnum.EXAMPLES]: this._cleanRecords(await ExampleService.getAll(db)),
            [TableEnum.EXAMPLE_RESULTS]: this._cleanRecords(await ExampleResultService.getAll(db)),
        }
        return backupData
    }

    /**
     * Deletes entire database. Require app reload to reinitialize the database.
     */
    static async deleteDatabase(db: Database) {
        return await db.delete()
    }

    /**
     * @TODO Remove this method after testing is complete.
     */
    static async testRecords(db: Database) {
        // Example
        const example = new Example({})
        example.desc =
            'This is an Example description. These descriptions can be quite long and detailed at 250 characters. Here is my attempt fill this space with text that makes sense. I want to see what this looks like when you are at the limit. This is enough.'
        // Example Result
        const exampleResult = new ExampleResult({ parentId: example.id })
        exampleResult.note =
            'This is the Example Result note. It has a limit of 250 characters just like the description.'
        // Pairing Updates
        example.lastChild = exampleResult
        // DB Creates
        await ExampleService.add(db, example)
        console.log('Test Example added', example)
        await ExampleResultService.add(db, exampleResult)
        console.log('Test Example Result added', exampleResult)
    }
}
