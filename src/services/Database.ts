import { AppName } from '@/shared/constants'
import { DBTable } from '@/shared/enums'
import Dexie from 'dexie'

class Database extends Dexie {
    // Required for easier TypeScript usage
    // [DBTable.SETTINGS]!: Table<Setting>;
    // [DBTable.LOGS]!: Table<any>;
    // [DBTable.EXAMPLES]!: Table<Example>;

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required
            [DBTable.SETTINGS]: '&key',
            [DBTable.LOGS]: '++autoId',
            [DBTable.EXAMPLES]: '&id, type, createdAt',
        })

        // Required
        // this[DBTable.SETTINGS].mapToClass(Setting)
        // this[DBTable.LOGS].mapToClass(Log)
        // this[DBTable.EXAMPLES].mapToClass(Example)
    }
}

/**
 * Use this preconfigured Database instance. Do NOT create another one!
 */
const DB = new Database(AppName)

export default DB
