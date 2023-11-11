import { Example, Log, Setting } from '@/models'
import { Constant, Enum, Type } from '@/shared'
import Dexie, { type Table } from 'dexie'

export class DatabaseTables extends Dexie {
    // Required for easier TypeScript usage
    [Enum.DBTable.SETTINGS]!: Table<Setting>;
    [Enum.DBTable.LOGS]!: Table<Log>;
    [Enum.DBTable.EXAMPLES]!: Table<Example>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [Enum.DBTable.SETTINGS]: '&key',
            [Enum.DBTable.LOGS]: '++autoId',
            [Enum.DBTable.EXAMPLES]: '&id, type, createdAt, *tags',
        })

        // Required for converting objects to classes
        this[Enum.DBTable.SETTINGS].mapToClass(Setting)
        this[Enum.DBTable.LOGS].mapToClass(Log)
        this[Enum.DBTable.EXAMPLES].mapToClass(Example)
    }
}

export class DatabaseApi {
    constructor(private dbt: DatabaseTables) {}

    //
    // Settings
    //

    /**
     * Never shortcut this method with getSettingValue() since it will return undefined if the setting is not found, or
     * if the setting value is undefined (which is a supported value for settings).
     */
    async getSetting(key: Type.SettingKey) {
        return await this.dbt.settings.get(key)
    }

    //
    // Logs
    //

    async addLog(logLevel: Type.LogLevel, label: Type.LogLabel, details?: Type.LogExtraDetails) {
        return await this.dbt.logs.add(new Log(logLevel, label, details))
    }
}

/**
 * Preconfigured instance of Database for the application
 */
export default new DatabaseApi(new DatabaseTables(Constant.AppName))
