import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import type { Database } from '@/services/Database'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
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
            default:
                throw new Error(`No Service found for Table/Id ${tableOrId}`)
        }
    }

    /**
     * @TODO
     */
    static async import(db: Database, backupData: BackupDataType) {
        return true
    }

    /**
     * @TODO
     */
    static async export(db: Database) {
        return {}
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
