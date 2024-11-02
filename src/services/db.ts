import { Example } from '@/models/Example'
import { ExampleResult } from '@/models/ExampleResult'
import { Log } from '@/models/Log'
import { Settings } from '@/models/Settings'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import Dexie, { type Table } from 'dexie'

/**
 * The database for the application defining the tables that are available and the models that are
 * mapped to those tables. An instance of this class is created and exported at the end of the file.
 */
export class Database extends Dexie {
    // Required for easier TypeScript usage
    [TableEnum.SETTINGS]!: Table<Settings>;
    [TableEnum.LOGS]!: Table<Log>;
    [TableEnum.EXAMPLES]!: Table<Example>;
    [TableEnum.EXAMPLE_RESULTS]!: Table<ExampleResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            [TableEnum.SETTINGS]: '&id',
            [TableEnum.LOGS]: '&id, createdAt',
            [TableEnum.EXAMPLES]: '&id, name, *status',
            [TableEnum.EXAMPLE_RESULTS]: '&id, createdAt, parentId',
        })

        this[TableEnum.SETTINGS].mapToClass(Settings)
        this[TableEnum.LOGS].mapToClass(Log)
        this[TableEnum.EXAMPLES].mapToClass(Example)
        this[TableEnum.EXAMPLE_RESULTS].mapToClass(ExampleResult)
    }
}

/**
 * Pre-instantiated database instance that can be used throughout the application.
 */
export const DB = new Database(`${appName} v${appDatabaseVersion}`)
