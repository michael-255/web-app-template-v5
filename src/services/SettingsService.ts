import Setting from '@/models/Setting'
import DB, { Database } from '@/services/db'
import { DurationEnum, SettingKeyEnum, TableEnum } from '@/shared/enums'
import { settingSchema } from '@/shared/schemas'
import type { SettingKeyType, SettingType, SettingValueType } from '@/shared/types'
import { liveQuery, type Observable } from 'dexie'

export default function SettingsService(db: Database = DB) {
    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async function initialize(): Promise<SettingType[]> {
        const defaultSettings: {
            [key in SettingKeyEnum]: SettingValueType
        } = {
            [SettingKeyEnum.ADVANCED_MODE]: false,
            [SettingKeyEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingKeyEnum.CONSOLE_LOGS]: false,
            [SettingKeyEnum.INFO_MESSAGES]: true,
            [SettingKeyEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingids = Object.values(SettingKeyEnum)

        const settings = await Promise.all(
            settingids.map(async (key) => {
                const setting = await db.table(TableEnum.SETTINGS).get(key)
                if (setting) {
                    return setting
                } else {
                    return new Setting({
                        key,
                        value: defaultSettings[key],
                    })
                }
            }),
        )

        await Promise.all(settings.map((s) => db.table(TableEnum.SETTINGS).put(s)))
        return settings
    }

    /**
     * Imports Settings into the database using put and returns invalid Settings.
     */
    async function importData(settings: SettingType[]): Promise<Partial<SettingType>[]> {
        const validSettings: SettingType[] = []
        const invalidSettings: Partial<SettingType>[] = []

        // Validate each setting
        settings.forEach((s) => {
            if (settingSchema.safeParse(s).success) {
                validSettings.push(settingSchema.parse(s)) // Clean record with parse
            } else {
                invalidSettings.push(s)
            }
        })

        // Put validated settings into the database
        await Promise.all(validSettings.map((s) => db.table(TableEnum.SETTINGS).put(s)))

        // Return invalid settings for FE error handling
        return invalidSettings
    }

    /**
     * Custom clear operation for Settings that clears and resets them with defaults.
     */
    async function clear() {
        await db.table(TableEnum.SETTINGS).clear()
        await initialize()
    }

    /**
     * Returns a Settings live query with default ordering.
     */
    function liveObservable(): Observable<SettingType[]> {
        return liveQuery(() => db.table(TableEnum.SETTINGS).toArray())
    }

    /**
     * Returns a Setting by key.
     */
    async function get(settingKey: SettingKeyType): Promise<SettingType> {
        const modelToGet = await db.table(TableEnum.SETTINGS).get(settingKey)
        if (!modelToGet) {
            throw new Error(`Setting key not found: ${settingKey}`)
        }
        return modelToGet!
    }

    /**
     * Creates or overwrites a Setting in the database.
     */
    async function put(setting: SettingType): Promise<SettingType> {
        const validatedSetting = settingSchema.parse(setting)
        await db.table(TableEnum.SETTINGS).put(validatedSetting)
        return validatedSetting
    }

    return {
        initialize,
        importData,
        clear,
        liveObservable,
        get,
        put,
    }
}
