import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { appDatabaseVersion, appName } from '@/shared/constants'
import {
    DBTableEnum,
    DurationEnum,
    DurationMSEnum,
    ParentTagEnum,
    SettingKeyEnum,
} from '@/shared/enums'
import {
    type BackupDataType,
    type DurationType,
    type LogAutoIdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type SettingKeyType,
    type SettingValueType,
    type UUIDType,
} from '@/shared/types'
import Dexie, { liveQuery, type Table } from 'dexie'

export class DatabaseTables extends Dexie {
    // Required for easier TypeScript usage
    [DBTableEnum.SETTINGS]!: Table<Setting>;
    [DBTableEnum.LOGS]!: Table<Log>;
    [DBTableEnum.EXAMPLES]!: Table<Example>;
    [DBTableEnum.EXAMPLE_RESULTS]!: Table<ExampleResult>

    constructor(name: string) {
        super(name)

        this.version(1).stores({
            // Required indexes
            [DBTableEnum.SETTINGS]: '&key',
            [DBTableEnum.LOGS]: '++autoId',
            [DBTableEnum.EXAMPLES]: '&id, createdAt, *tags',
            [DBTableEnum.EXAMPLE_RESULTS]: '&id, parentId, createdAt',
        })

        // Required for converting objects to classes
        this[DBTableEnum.SETTINGS].mapToClass(Setting)
        this[DBTableEnum.LOGS].mapToClass(Log)
        this[DBTableEnum.EXAMPLES].mapToClass(Example)
        this[DBTableEnum.EXAMPLE_RESULTS].mapToClass(ExampleResult)
    }
}

export class DatabaseApi {
    constructor(private dbt: DatabaseTables) {}

    //
    // Settings
    //

    async initSettings() {
        const defaultSettings: Readonly<{
            [key in SettingKeyEnum]: SettingValueType
        }> = {
            [SettingKeyEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingKeyEnum.ADVANCED_MODE]: false,
            [SettingKeyEnum.CONSOLE_LOGS]: false,
            [SettingKeyEnum.INFO_MESSAGES]: true,
            [SettingKeyEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingKeys = Object.values(SettingKeyEnum)

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

    async getSetting(key: SettingKeyType) {
        return await this.dbt.settings.get(key)
    }

    async setSetting(key: SettingKeyType, value: SettingValueType) {
        return await this.dbt.settings.put(new Setting(key, value))
    }

    //
    // Logs
    //

    async purgeLogs() {
        const logRetentionDuration = (
            await this.dbt.settings.get(SettingKeyEnum.LOG_RETENTION_DURATION)
        )?.value as DurationType

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const logs = await this.dbt.logs.toArray()
        const durationMs = DurationMSEnum[logRetentionDuration] // Convert Duration to milliseconds
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

    async addLog(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        return await this.dbt.logs.add(new Log(logLevel, label, details))
    }

    async clearLogs() {
        return await this.dbt.logs.clear()
    }

    async getLog(autoId: LogAutoIdType) {
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

    liveExamples() {
        return liveQuery(() => this.dbt.examples.orderBy('createdAt').reverse().toArray())
    }

    liveExampleResults() {
        return liveQuery(() => this.dbt.exampleResults.orderBy('createdAt').reverse().toArray())
    }

    /**
     * Can't use a proxy to update the model, so must get full model database
     */
    async toggleFavorite(parentModel: Example) {
        if (parentModel instanceof Example) {
            const model = (await this.dbt.examples.get(parentModel.id))!
            const index = model.tags.indexOf(ParentTagEnum.FAVORITED)
            if (index === -1) {
                model.tags.push(ParentTagEnum.FAVORITED)
            } else {
                model.tags.splice(index, 1)
            }
            return await this.dbt.examples.put(model)
        } else {
            throw new Error('Cannot toggle favorite on unknown model type')
        }
    }

    //
    // Examples
    //

    async getExample(id: UUIDType) {
        return await this.dbt.examples.get(id)
    }

    async addExample(model: Example) {
        return await this.dbt.examples.add(model)
    }

    async putExample(model: Example) {
        return await this.dbt.examples.put(model)
    }

    async updateExample(id: UUIDType, changedProps: Partial<Example>) {
        return await this.dbt.examples.update(id, changedProps)
    }

    async deleteExample(id: UUIDType) {
        return await this.dbt.examples.delete(id)
    }

    //
    // Example Results
    //

    async getExampleResult(id: UUIDType) {
        return await this.dbt.exampleResults.get(id)
    }

    async addExampleResult(model: ExampleResult) {
        return await this.dbt.exampleResults.add(model)
    }

    async putExampleResult(model: ExampleResult) {
        return await this.dbt.exampleResults.put(model)
    }

    async updateExampleResult(id: UUIDType, changedProps: Partial<ExampleResult>) {
        return await this.dbt.exampleResults.update(id, changedProps)
    }

    async deleteExampleResult(id: UUIDType) {
        return await this.dbt.exampleResults.delete(id)
    }

    //
    // Database
    //

    /**
     * @TODO Improvement: Validate data before importing
     */
    async importData(backupData: BackupDataType) {
        // Import settings first in case errors stop type importing below
        const backupSettings = backupData[DBTableEnum.SETTINGS]
        if (backupSettings.length > 0) {
            await Promise.all(
                backupSettings
                    .filter((setting) => Object.values(SettingKeyEnum).includes(setting.key))
                    .map(async (setting) => await this.setSetting(setting.key, setting.value)),
            )
        }

        // Log are not imported
        await Promise.all([
            this.dbt.examples.bulkAdd(backupData[DBTableEnum.EXAMPLES]),
            this.dbt.exampleResults.bulkAdd(backupData[DBTableEnum.EXAMPLE_RESULTS]),
        ])
        return
    }

    /**
     * @TODO Improvement: Remove previous data field before exporting to save space
     */
    async getBackupData() {
        const backupData: BackupDataType = {
            appName: appName,
            databaseVersion: appDatabaseVersion,
            createdAt: Date.now(),
            [DBTableEnum.SETTINGS]: await this.dbt.settings.toArray(),
            [DBTableEnum.LOGS]: await this.dbt.logs.toArray(),
            [DBTableEnum.EXAMPLES]: await this.dbt.examples.toArray(),
            [DBTableEnum.EXAMPLE_RESULTS]: await this.dbt.exampleResults.toArray(),
        }
        return backupData
    }

    async clearAppData() {
        await Promise.all([
            this.dbt.settings.clear(),
            this.dbt.logs.clear(),
            this.dbt.examples.clear(),
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
export default new DatabaseApi(new DatabaseTables(`${appName} v${appDatabaseVersion}`))
