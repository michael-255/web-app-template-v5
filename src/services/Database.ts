import { Example, Log, Setting } from '@/models'
import { Constant, Enum, Type } from '@/shared'
import Dexie, { type Table } from 'dexie'

class Database extends Dexie {
    // Required for easier TypeScript usage
    [Enum.DBTable.SETTINGS]!: Table<Setting>;
    [Enum.DBTable.LOGS]!: Table<any>;
    [Enum.DBTable.EXAMPLES]!: Table<Example>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [Enum.DBTable.SETTINGS]: '&key',
            [Enum.DBTable.LOGS]: '++autoId',
            [Enum.DBTable.EXAMPLES]: '&id, type, createdAt, *tags',
        })

        // Required for converting objects to classes via the constructor
        this[Enum.DBTable.SETTINGS].mapToClass(Setting)
        this[Enum.DBTable.LOGS].mapToClass(Log)
        this[Enum.DBTable.EXAMPLES].mapToClass(Example)
    }

    //
    // Settings (internal)
    //

    async getSettingValue(key: Type.SettingKey): Promise<Type.SettingValue> {
        return (await this.table(Enum.DBTable.SETTINGS).get(key))?.value
    }

    //
    // Logs (internal)
    //

    async addLog(logLevel: Type.LogLevel, label: Type.LogLabel, details?: Type.LogExtraDetails) {
        return await this.table(Enum.DBTable.LOGS).add(new Log(logLevel, label, details))
    }
}

/**
 * Use this preconfigured Database instance. Do NOT create another one!
 */
const DB = new Database(Constant.AppName)

export default DB
