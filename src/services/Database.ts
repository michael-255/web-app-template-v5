import { ExampleConfig, ExampleResult, Log, Setting } from '@/models'
import { Constant, Enum, Type } from '@/shared'
import Dexie, { liveQuery, type Table } from 'dexie'

export class DatabaseTables extends Dexie {
    // Required for easier TypeScript usage
    [Enum.DBTable.SETTINGS]!: Table<Setting>;
    [Enum.DBTable.LOGS]!: Table<Log>;
    [Enum.DBTable.EXAMPLE_CONFIGS]!: Table<ExampleConfig>;
    [Enum.DBTable.EXAMPLE_RESULTS]!: Table<ExampleResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [Enum.DBTable.SETTINGS]: '&key',
            [Enum.DBTable.LOGS]: '++autoId',
            [Enum.DBTable.EXAMPLE_CONFIGS]: '&id, type, createdAt, *tags',
            [Enum.DBTable.EXAMPLE_RESULTS]: '&id, configId, createdAt',
        })

        // Required for converting objects to classes
        this[Enum.DBTable.SETTINGS].mapToClass(Setting)
        this[Enum.DBTable.LOGS].mapToClass(Log)
        this[Enum.DBTable.EXAMPLE_CONFIGS].mapToClass(ExampleConfig)
        this[Enum.DBTable.EXAMPLE_RESULTS].mapToClass(ExampleResult)
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
            [Enum.SettingKey.ADVANCED_MODE]: false,
            [Enum.SettingKey.CONSOLE_LOGS]: false,
            [Enum.SettingKey.INFO_MESSAGES]: true,
            [Enum.SettingKey.LOG_RETENTION_DURATION]: Enum.Duration[Enum.Duration['Six Months']],
            // TODO - Settings for visible columns in tables
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

    async getSetting(key: Type.SettingKey) {
        return await this.dbt.settings.get(key)
    }

    async setSetting(key: Type.SettingKey, value: Type.SettingValue) {
        return await this.dbt.settings.put(new Setting(key, value))
    }

    //
    // Logs
    //

    async purgeLogs() {
        const logRetentionDuration = (
            await this.dbt.settings.get(Enum.SettingKey.LOG_RETENTION_DURATION)
        )?.value as Type.Duration

        if (!logRetentionDuration || logRetentionDuration === Enum.Duration.Forever) {
            return 0 // No logs purged
        }

        const logs = await this.dbt.logs.toArray()
        const durationMs = Enum.DurationMS[logRetentionDuration] // Convert Duration to milliseconds
        const now = Date.now()

        // Find Logs that are older than the retention time and map them to their keys
        const removableLogs = logs
            .filter((log: Log) => {
                const logTimestamp = log.createdAt ?? 0
                const logAge = now - logTimestamp
                return logAge > durationMs
            })
            .map((log: Log) => log.autoId!) // Map remaining Log ids for removal with non-null assertion

        await this.dbt.logs.bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    async addLog(logLevel: Type.LogLevel, label: Type.LogLabel, details?: Type.LogDetails) {
        return await this.dbt.logs.add(new Log(logLevel, label, details))
    }

    async clearLogs() {
        return await this.dbt.logs.clear()
    }

    async getLog(autoId: Type.LogAutoId) {
        return await this.dbt.logs.get(Number(autoId))
    }

    //
    // Live Queries
    //

    liveSettings() {
        return liveQuery(() => this.dbt.settings.toArray())
    }

    liveLogs() {
        return liveQuery(() => this.dbt.logs.orderBy('autoId').reverse().toArray())
    }

    //
    // Database
    //

    /**
     * @TODO Improvement: Validate data before importing
     */
    async importData(backupData: Type.BackupData) {
        // Import settings first in case errors stop type importing below
        const backupSettings = backupData[Enum.DBTable.SETTINGS]
        if (backupSettings.length > 0) {
            await Promise.all(
                backupSettings
                    .filter((setting) => Object.values(Enum.SettingKey).includes(setting.key))
                    .map(async (setting) => await this.setSetting(setting.key, setting.value)),
            )
        }

        // Log are not imported
        await Promise.all([
            this.dbt.exampleConfigs.bulkAdd(backupData[Enum.DBTable.EXAMPLE_CONFIGS]),
            this.dbt.exampleResults.bulkAdd(backupData[Enum.DBTable.EXAMPLE_RESULTS]),
        ])
        return
    }

    /**
     * @TODO Improvement: Remove previous data field before exporting to save space
     */
    async getBackupData() {
        const backupData: Type.BackupData = {
            appName: Constant.AppName,
            databaseVersion: Constant.AppDatabaseVersion,
            createdAt: Date.now(),
            [Enum.DBTable.SETTINGS]: await this.dbt.settings.toArray(),
            [Enum.DBTable.LOGS]: await this.dbt.logs.toArray(),
            [Enum.DBTable.EXAMPLE_CONFIGS]: await this.dbt.exampleConfigs.toArray(),
            [Enum.DBTable.EXAMPLE_RESULTS]: await this.dbt.exampleResults.toArray(),
        }
        return backupData
    }

    async clearAppData() {
        await Promise.all([
            this.dbt.settings.clear(),
            this.dbt.logs.clear(),
            this.dbt.exampleConfigs.clear(),
            this.dbt.exampleResults.clear(),
        ])
        return await this.initSettings()
    }

    async deleteDatabase() {
        return await this.dbt.delete()
    }
}

/**
 * Preconfigured instance of Database for the application
 */
export default new DatabaseApi(
    new DatabaseTables(`${Constant.AppName} v${Constant.AppDatabaseVersion}`),
)
