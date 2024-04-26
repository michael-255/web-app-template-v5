import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import type { Database } from '@/services/db'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { SlugTableEnum, TableEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import type { BackupDataType, IdType, ModelType } from '@/shared/types'

/**
 * The `DatabaseService` handles database wide operations and provides utilities for selecting the
 * correct `Service` for model operations.
 */
export default class DatabaseService {
    /**
     * @TODO
     */
    static getService(tableOrId: TableEnum | SlugTableEnum | IdType) {
        let table = tableOrId

        if (idSchema.safeParse(tableOrId).success) {
            // Extract Table from Id prefix
            table = tableOrId.substring(0, 3) as TableEnum
        }

        switch (table) {
            case TableEnum.SETTINGS:
            case SlugTableEnum.SETTINGS:
                return SettingService
            case TableEnum.LOGS:
            case SlugTableEnum.LOGS:
                return LogService
            case TableEnum.EXAMPLES:
            case SlugTableEnum.EXAMPLES:
                return ExampleService
            case TableEnum.EXAMPLE_RESULTS:
            case SlugTableEnum.EXAMPLE_RESULTS:
                return ExampleResultService
            // Table changes should be reflected here...
            default:
                throw new Error(`No Service found for Table/Id ${tableOrId}`)
        }
    }

    /**
     * Imports and schema parses the records from a backup into the database tables. Returns any
     * records that were skipped during the import for further investigation.
     */
    static async import(db: Database, backupData: BackupDataType) {
        const importedData: { [key in TableEnum]: Promise<ModelType[]> } = {} as {
            [key in TableEnum]: Promise<ModelType[]>
        }

        await Promise.all(
            Object.values(TableEnum).map(async (t) => {
                importedData[t] = this.getService(t).import(db, backupData[t] ?? [])
            }),
        )

        // TODO - Processing to update lastChild relationships
        return importedData
    }

    /**
     * @TODO
     */
    static async export(db: Database) {
        const backupData: BackupDataType = {
            appName: appName,
            databaseVersion: appDatabaseVersion,
            createdAt: Date.now(),
        } as BackupDataType

        await Promise.all(
            Object.values(TableEnum).map(async (t) => {
                backupData[t] = await this.getService(t).export(db)
            }),
        )

        return backupData
    }

    /**
     * @todo
     */
    static async clearAll(db: Database) {
        await Promise.all(
            Object.values(TableEnum).map(async (t) => {
                await this.getService(t).clear(db)
            }),
        )
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
    static async testing(db: Database) {
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
