import Setting from '@/models/Setting'
import BaseModelService from '@/services/_BaseModelService'
import { DurationEnum, SettingIdEnum, SlugTableEnum, TableEnum } from '@/shared/enums'
import { settingSchema } from '@/shared/schemas'
import type { ModelType, SettingValueType } from '@/shared/types'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `SettingService` handles database operations with the `Setting` models.
 */
export default class SettingService extends BaseModelService {
    static Model: typeof Setting = Setting
    static labelSingular: string = 'Setting'
    static labelPlural: string = 'Settings'
    static modelSchema: z.ZodSchema<any> = settingSchema
    static table: TableEnum = TableEnum.SETTINGS
    static slugTable: SlugTableEnum = SlugTableEnum.SETTINGS

    /**
     * @override
     * @todo
     */
    static async import(db: Database, models: ModelType[]) {
        const { validModels, skippedModels } = this.validate(models)
        await Promise.all(
            validModels.map((m) =>
                SettingService.put(db, new Setting({ id: m.id, value: m.value })),
            ),
        )
        return skippedModels
    }

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    static async initSettings(db: Database): Promise<Setting[]> {
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

    /**
     * @todo
     */
    static async clear(db: Database) {
        await db.table(TableEnum.SETTINGS).clear()
        await this.initSettings(db)
    }
}
