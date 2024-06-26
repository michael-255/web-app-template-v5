import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import type { Database } from '@/services/db'
import exampleResultService from '@/services/ExampleResultService'
import exampleService from '@/services/ExampleService'
import logService from '@/services/LogService'
import settingService from '@/services/SettingService'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { RouteTableEnum, TableEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import type { BackupDataType, IdType, ModelType } from '@/shared/types'

/**
 * The `DatabaseManager` handles database wide operations and provides utilities for selecting the
 * correct `Service` for model operations.
 */
export default class DatabaseManager {
    /**
     * Returns the correct `Service` for the given table or id.
     */
    static getService(tableOrId: TableEnum | RouteTableEnum | IdType) {
        let table = tableOrId

        if (idSchema.safeParse(tableOrId).success) {
            // Extract Table from Id prefix
            table = tableOrId.substring(0, 3) as TableEnum
        }

        switch (table) {
            case TableEnum.SETTINGS:
            case RouteTableEnum.SETTINGS:
                return settingService
            case TableEnum.LOGS:
            case RouteTableEnum.LOGS:
                return logService
            case TableEnum.EXAMPLES:
            case RouteTableEnum.EXAMPLES:
                return exampleService
            case TableEnum.EXAMPLE_RESULTS:
            case RouteTableEnum.EXAMPLE_RESULTS:
                return exampleResultService
            // Table changes should be reflected here...
            default:
                throw new Error(`No Service found for Table/Id ${tableOrId}`)
        }
    }

    /**
     * Returns all `Service` instances for the database tables.
     */
    static getServices() {
        const tables = Object.values(TableEnum)
        return tables.map((t) => this.getService(t))
    }

    /**
     * Imports, schema parses, and reassociates the records from a backup into the database tables.
     * Returns any records that were skipped during the import for further investigation.
     */
    static async import(db: Database, backupData: BackupDataType) {
        const skippedRecords: { [key in TableEnum]: ModelType[] } = {} as {
            [key in TableEnum]: ModelType[]
        }

        await Promise.all(
            Object.values(TableEnum).map(async (t) => {
                skippedRecords[t] = await this.getService(t).import(db, backupData[t] ?? [])
            }),
        )
        await Promise.all(
            Object.values(TableEnum).map(async (t) => this.getService(t).updateAssociations(db)),
        )

        return skippedRecords
    }

    /**
     * Exports all records from the database into a backup object.
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
     * Clears all records from the database tables.
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
        await exampleService.add(db, example)
        console.log('Test Example added', example)
        await exampleResultService.add(db, exampleResult)
        console.log('Test Example Result added', exampleResult)
    }
}
