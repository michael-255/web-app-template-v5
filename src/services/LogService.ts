import Log from '@/models/Log'
import type { Database } from '@/services/Database'
import ModelService from '@/services/_ModelService'
import { DurationEnum, DurationMSEnum, GroupEnum, SettingIdEnum, TableEnum } from '@/shared/enums'
import { logSchema } from '@/shared/schemas'
import type { z } from 'zod'

/**
 * @TODO
 */
export default class LogService extends ModelService {
    static Model: typeof Log = Log
    static labelSingular: string = 'Log'
    static labelPlural: string = 'Logs'
    static schema: z.ZodSchema<any> = logSchema
    static table: TableEnum = TableEnum.LOGS
    static group: GroupEnum = GroupEnum.STANDALONE

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
