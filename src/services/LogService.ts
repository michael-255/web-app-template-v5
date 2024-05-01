import Log from '@/models/Log'
import type Setting from '@/models/Setting'
import BaseModelService from '@/services/abstract/BaseModelService'
import type { Database } from '@/services/db'
import {
    DurationEnum,
    DurationMSEnum,
    SettingIdEnum,
    SlugTableEnum,
    TableEnum,
} from '@/shared/enums'
import { logSchema } from '@/shared/schemas'
import type { IdType, ModelType, SelectOption } from '@/shared/types'
import type { Observable } from 'dexie'
import type { Component } from 'vue'
import type { z } from 'zod'

/**
 * The `LogService` handles database operations with the `Log` models.
 */
export class LogService extends BaseModelService {
    private static _instance: LogService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): LogService {
        if (!LogService._instance) {
            LogService._instance = new LogService()
        }
        return LogService._instance
    }

    Model: typeof Log = Log
    labelSingular: string = 'Log'
    labelPlural: string = 'Logs'
    modelSchema: z.ZodSchema<any> = logSchema
    table: TableEnum = TableEnum.LOGS
    slugTable: SlugTableEnum = SlugTableEnum.LOGS
    parentTable: TableEnum = null!
    childTable: TableEnum = null!

    /**
     * Returns all records in the table sorted by creation date in descending order.
     */
    async getAll(db: Database) {
        return await db.table(this.table).orderBy('createdAt').reverse().toArray()
    }

    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    async purgeLogs(db: Database) {
        const logRetentionDuration = (
            await db.table(TableEnum.SETTINGS).get(SettingIdEnum.LOG_RETENTION_DURATION)
        )?.value as DurationEnum

        if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
            return 0 // No logs purged
        }

        const allLogs = await db.table(TableEnum.LOGS).toArray()
        const maxLogAgeMs = DurationMSEnum[logRetentionDuration]
        const now = Date.now()

        // Find Logs that are older than the retention time and map them to their keys
        const removableLogs = allLogs
            .filter((log: Log) => {
                const logTimestamp = log.createdAt ?? 0
                const logAge = now - logTimestamp
                return logAge > maxLogAgeMs
            })
            .map((log: Log) => log.id) // Map remaining Log ids for removal

        await db.table(TableEnum.LOGS).bulkDelete(removableLogs)
        return removableLogs.length // Number of logs deleted
    }

    // eslint-disable-next-line
    liveDashboard(db: Database): Observable<any[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    clean(models: ModelType[]): ModelType[] {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    updateLastChild(db: Database, parentId: IdType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    toggleFavorite(db: Database, model: ModelType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    getSelectOptions(db: Database): Promise<SelectOption[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    initSettings(db: Database): Promise<Setting[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    formComponents(mutation: 'Create' | 'Edit'): Component[] {
        throw new Error('Not supported on this Service')
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default LogService.getSingleton()
