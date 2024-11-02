import { DurationEnum } from '@/shared/enums'
import { z } from 'zod'

//
// Enums
//

/**
 * The only valid IDs for settings in the application.
 */
export enum SettingIdEnum {
    ADVANCED_MODE = 'Advanced Mode',
    INSTRUCTIONS_OVERLAY = 'Instructions Overlay',
    CONSOLE_LOGS = 'Console Logs',
    INFO_MESSAGES = 'Info Messages',
    LOG_RETENTION_DURATION = 'Log Rentention Duration',
}

//
// Schemas
//

export const settingIdSchema = z.nativeEnum(SettingIdEnum)

// Can be updated for settings with different type requirements
export const settingValueSchema = z.union([z.boolean(), z.nativeEnum(DurationEnum)])

export const settingSchema = z.object({
    id: settingIdSchema, // Instead of standard ID
    value: settingValueSchema,
})

//
// Types
//

export type SettingIdType = z.infer<typeof settingIdSchema>
export type SettingValueType = z.infer<typeof settingValueSchema>

export type SettingType = z.infer<typeof settingSchema>

interface SettingParams {
    id: SettingIdType
    value: SettingValueType
}

//
// Model
//

/**
 * Application `Setting` model.
 *
 * This model is used for app wide settings. They are initialized and live queried during startup
 * in `App.vue` and stored in the `SettingsStore` for easy access.
 */
export class Setting {
    id: SettingIdType // Instead of standard ID
    value: SettingValueType

    constructor(params: SettingParams) {
        this.id = params.id
        this.value = params.value
    }
}
