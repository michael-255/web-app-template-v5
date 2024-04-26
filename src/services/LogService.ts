import Log from '@/models/Log'
import BaseModelService from '@/services/_BaseModelService'
import type { Database } from '@/services/db'
import {
    DurationEnum,
    DurationMSEnum,
    GroupEnum,
    SettingIdEnum,
    SlugTableEnum,
    TableEnum,
} from '@/shared/enums'
import { logSchema } from '@/shared/schemas'
import type { z } from 'zod'

/**
 * The `LogService` handles database operations with the `Log` models.
 */
export default class LogService extends BaseModelService {
    static Model: typeof Log = Log
    static labelSingular: string = 'Log'
    static labelPlural: string = 'Logs'
    static modelSchema: z.ZodSchema<any> = logSchema
    static table: TableEnum = TableEnum.LOGS
    static slugTable: SlugTableEnum = SlugTableEnum.LOGS
    static group: GroupEnum = GroupEnum.STANDALONE

    /**
     * @todo
     */
    static async getAll(db: Database) {
        return await db.table(this.table).orderBy('createdAt').reverse().toArray()
    }

    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    static async purgeLogs(db: Database) {
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
}
