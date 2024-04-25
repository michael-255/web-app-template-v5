import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import type Log from '@/models/Log'
import type Setting from '@/models/Setting'
import type { Database } from '@/services/Database'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import type { BackupDataType, IdType } from '@/shared/types'

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
            // Add additional tables here...
            default:
                throw new Error(`No Service found for Table/Id ${tableOrId}`)
        }
    }

    /**
     * Imports and schema parses the records from a backup into the database tables. Returns any
     * records that were skipped during the import for further investigation.
     */
    static async import(db: Database, backupData: BackupDataType) {
        const skippedRecords = {
            [TableEnum.SETTINGS]: await SettingService.import(
                db,
                backupData[TableEnum.SETTINGS] ?? [],
            ),
            [TableEnum.LOGS]: await LogService.import(db, backupData[TableEnum.LOGS] ?? []),
            [TableEnum.EXAMPLES]: await ExampleService.import(
                db,
                backupData[TableEnum.EXAMPLES] ?? [],
            ),
            [TableEnum.EXAMPLE_RESULTS]: await ExampleResultService.import(
                db,
                backupData[TableEnum.EXAMPLE_RESULTS] ?? [],
            ),
            // Add additional tables here...
        }
        // TODO - Processing to update lastChild relationships
        return skippedRecords
    }

    /**
     * @TODO
     */
    static async export(db: Database) {
        const backupData: BackupDataType = {
            appName: appName,
            databaseVersion: appDatabaseVersion,
            createdAt: Date.now(),
            [TableEnum.SETTINGS]: (await SettingService.export(db)) as Setting[],
            [TableEnum.LOGS]: (await LogService.export(db)) as Log[],
            [TableEnum.EXAMPLES]: (await ExampleService.export(db)) as Example[],
            [TableEnum.EXAMPLE_RESULTS]: (await ExampleResultService.export(db)) as ExampleResult[],
            // Add additional tables here...
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
