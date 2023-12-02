import { Example, Log, Setting } from '@/models'
import { Constant, Enum, Type } from '@/shared'
import Dexie, { type Table } from 'dexie'

export class DatabaseTables extends Dexie {
    // Required for easier TypeScript usage
    [Enum.DBTable.SETTINGS]!: Table<Setting>;
    [Enum.DBTable.LOGS]!: Table<Log>;
    [Enum.DBTable.EXAMPLE_CONFIGS]!: Table<Example>;
    [Enum.DBTable.EXAMPLE_RESULTS]!: Table<Example> // TODO

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [Enum.DBTable.SETTINGS]: '&key',
            [Enum.DBTable.LOGS]: '++autoId',
            [Enum.DBTable.EXAMPLE_CONFIGS]: '&id, type, createdAt, *tags',
            [Enum.DBTable.EXAMPLE_RESULTS]: '&id, configId, createdAt', // TODO
        })

        // Required for converting objects to classes
        this[Enum.DBTable.SETTINGS].mapToClass(Setting)
        this[Enum.DBTable.LOGS].mapToClass(Log)
        this[Enum.DBTable.EXAMPLE_CONFIGS].mapToClass(Example)
        this[Enum.DBTable.EXAMPLE_RESULTS].mapToClass(Example) // TODO
    }
}

export class DatabaseApi {
    constructor(private dbt: DatabaseTables) {}

    //
    // Settings
    //

    async initSettings() {
        const defaultSettings: Readonly<{
            [key in Enum.SettingKey]: Type.SettingValue
        }> = {
            [Enum.SettingKey.INSTRUCTIONS_OVERLAY]: true,
            [Enum.SettingKey.CONSOLE_LOGS]: false,
            [Enum.SettingKey.INFO_MESSAGES]: true,
            [Enum.SettingKey.LOG_RETENTION_DURATION]: Enum.Duration['Six Months'],
        }

        const settingKeys = Object.values(Enum.SettingKey)

        const settings = await Promise.all(
            settingKeys.map(async (key) => {
                const setting = await this.dbt.settings.get(key)

                if (setting) {
                    return setting
                } else {
                    return { key, value: defaultSettings[key] }
                }
            }),
        )

        await Promise.all(settings.map((s) => this.dbt.settings.put(new Setting(s.key, s.value))))
        return settings
    }

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

    async purgeLogs() {
        const logRetentionDuration = (await this.dbt.settings.get(Enum.SettingKey.LOG_RETENTION_DURATION))
            ?.value as Type.Duration

        if (!logRetentionDuration || logRetentionDuration === Enum.Duration.Forever) {
            return 0 // No logs purged
        }

        const logs = await this.dbt.logs.toArray()
        const now = Date.now()

        // Find Logs that are older than the retention time and map them to their keys
        const removableLogs = logs
            .filter((log: Log) => {
                const logTimestamp = log.createdAt ?? 0
                const logAge = now - logTimestamp
                return logAge > logRetentionDuration
            })
            .map((log: Log) => log.autoId!) // Map remaining Log ids for removal with non-null assertion

        await this.dbt.logs.bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    async addLog(logLevel: Type.LogLevel, label: Type.LogLabel, details?: Type.LogDetails) {
        return await this.dbt.logs.add(new Log(logLevel, label, details))
    }
}

/**
 * Preconfigured instance of Database for the application
 */
export default new DatabaseApi(new DatabaseTables(Constant.AppName))
