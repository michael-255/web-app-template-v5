import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { DBTableEnum, DurationEnum, DurationMSEnum, SettingKeyEnum, TagEnum } from '@/shared/enums'
import {
    type BackupDataType,
    type DBRecordType,
    type DurationType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type SettingKeyType,
    type SettingValueType,
    type UUIDType,
} from '@/shared/types'
import { getParentTable, schemaParseModel, truncateText } from '@/shared/utils'
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
            [DBTableEnum.LOGS]: '&id, createdAt',
            [DBTableEnum.EXAMPLES]: '&id, name, *tags',
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
    // Internal
    //

    private _notSupportedTableGuard(table: DBTableEnum, notSupported: DBTableEnum[] = []) {
        notSupported.push('' as any, undefined as any, null as any) // Default unsupported values
        if (notSupported.includes(table)) {
            throw new Error(`Unsupported table: ${table}`)
        }
    }

    private _recordMissingGuard(table: DBTableEnum, id: UUIDType, record?: DBRecordType) {
        if (!record) {
            throw new Error(`Record not found on table ${table} with id ${id}`)
        }
    }

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

    async addLog(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        return await this.dbt.logs.add(new Log(logLevel, label, details))
    }

    async clearLogs() {
        return await this.dbt.logs.clear()
    }

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
            .map((log: Log) => log.id) // Map remaining Log ids for removal

        await this.dbt.logs.bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    //
    // Live Queries
    //

    liveSettings() {
        return liveQuery(() => this.dbt.settings.toArray())
    }

    liveLogs() {
        return liveQuery(() => this.dbt.logs.orderBy('createdAt').reverse().toArray())
    }

    liveExamples() {
        return liveQuery(() => this.dbt.examples.orderBy('name').toArray())
    }

    /**
     * Gets data sorted by name and enabled first, then sorts favortied first.
     */
    liveDashboardExamples() {
        return liveQuery(() =>
            this.dbt.examples
                .orderBy('name')
                .filter((r) => r.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((examples) =>
                    examples.sort((a, b) => {
                        const aIsFavorited = a.tags.includes(TagEnum.FAVORITED)
                        const bIsFavorited = b.tags.includes(TagEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        } else if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        } else {
                            // If both or neither are favorited, sort alphabetically by name
                            return a.name.localeCompare(b.name)
                        }
                    }),
                ),
        )
    }

    liveExampleResults() {
        return liveQuery(() => this.dbt['example-results'].orderBy('createdAt').reverse().toArray())
    }

    //
    // WIP
    //

    async getRecord(table: DBTableEnum, id: UUIDType): Promise<DBRecordType> {
        this._notSupportedTableGuard(table, [DBTableEnum.SETTINGS])
        const recordToGet = await this.dbt[table].get(id)
        this._recordMissingGuard(table, id, recordToGet)
        return recordToGet!
    }

    async createRecord(table: DBTableEnum, model: DBRecordType) {
        this._notSupportedTableGuard(table, [DBTableEnum.SETTINGS, DBTableEnum.LOGS])
        return await this.dbt.table(table).add(schemaParseModel(table, model))
    }

    async putRecord(table: DBTableEnum, model: DBRecordType) {
        this._notSupportedTableGuard(table, [DBTableEnum.SETTINGS, DBTableEnum.LOGS])
        return await this.dbt.table(table).put(schemaParseModel(table, model))
    }

    async deleteRecord(table: DBTableEnum, id: UUIDType): Promise<DBRecordType> {
        this._notSupportedTableGuard(table, [DBTableEnum.SETTINGS, DBTableEnum.LOGS])
        const recordToDelete = await this.dbt[table].get(id)
        this._recordMissingGuard(table, id, recordToDelete)
        await this.dbt[table].delete(id)
        return recordToDelete!
    }

    async getParentIdOptions(table: DBTableEnum) {
        const records = await this.dbt.table(getParentTable(table)).orderBy('name').toArray()

        return records.map((r: DBRecordType) => ({
            value: r.id as UUIDType,
            label: `${r.name} (${truncateText(r.id, 8, '*')})`,
            disable: r.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }

    //
    // Miscellaneous
    //

    async toggleFavorite(table: DBTableEnum, parentModel: DBRecordType) {
        if ('tags' in parentModel) {
            // Can't use proxy model, so must get from DB
            const model = (await this.getRecord(table, parentModel.id))!
            const index = model.tags.indexOf(TagEnum.FAVORITED)
            if (index === -1) {
                model.tags.push(TagEnum.FAVORITED)
            } else {
                model.tags.splice(index, 1)
            }
            return await this.putRecord(table, model)
        } else {
            throw new Error('Cannot toggle favorite on model without tags property')
        }
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
            this.dbt['example-results'].bulkAdd(backupData[DBTableEnum.EXAMPLE_RESULTS]),
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
            [DBTableEnum.EXAMPLE_RESULTS]: await this.dbt['example-results'].toArray(),
        }
        return backupData
    }

    async clearAppData() {
        await Promise.all([
            this.dbt.settings.clear(),
            this.dbt.logs.clear(),
            this.dbt.examples.clear(),
            this.dbt['example-results'].clear(),
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
