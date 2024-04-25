import Setting from '@/models/Setting'
import ModelService from '@/services/_ModelService'
import { DurationEnum, GroupEnum, SettingIdEnum, TableEnum } from '@/shared/enums'
import { settingSchema } from '@/shared/schemas'
import type { DBRecordType, SettingValueType } from '@/shared/types'
import type { z } from 'zod'
import type { Database } from './Database'

/**
 * @TODO
 */
export default class SettingService extends ModelService {
    static Model: typeof Setting = Setting
    static labelSingular: string = 'Setting'
    static labelPlural: string = 'Settings'
    static schema: z.ZodSchema<any> = settingSchema
    static table: TableEnum = TableEnum.SETTINGS
    static group: GroupEnum = GroupEnum.STANDALONE

    /**
     * @override
     * @todo
     */
    static validateRecords(records: DBRecordType[]) {
        const validRecords: DBRecordType[] = []
        const skippedRecords: DBRecordType[] = []
        const settingIds = Object.values(SettingIdEnum)

        records.forEach((s) => {
            // Only use backup Settings that are in the SettingIdEnum
            if (settingIds.includes(s.id)) {
                validRecords.push(s) // Using put later will schema parse the Setting
            } else {
                skippedRecords.push(s)
            }
        })

        return { validRecords, skippedRecords }
    }

    /**
     * @override
     * @todo
     */
    static async import(db: Database, records: DBRecordType[]) {
        const { validRecords, skippedRecords } = this.validateRecords(records)
        await Promise.all(
            validRecords.map((s) =>
                SettingService.put(db, new Setting({ id: s.id, value: s.value })),
            ),
        )
        return skippedRecords
    }

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    static async initSettings(db: Database) {
        const defaultSettings: {
            [key in SettingIdEnum]: SettingValueType
        } = {
            [SettingIdEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingIdEnum.CONSOLE_LOGS]: false,
            [SettingIdEnum.INFO_MESSAGES]: true,
            [SettingIdEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingids = Object.values(SettingIdEnum)

        const settings = await Promise.all(
            settingids.map(async (id) => {
                const setting = await db.table(TableEnum.SETTINGS).get(id)
                if (setting) {
                    return setting
                } else {
                    return new Setting({
                        id,
                        value: defaultSettings[id],
                    })
                }
            }),
        )

        await Promise.all(settings.map((s) => db.table(TableEnum.SETTINGS).put(s)))
        return settings
    }
}
