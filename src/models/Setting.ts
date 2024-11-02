import type { SettingIdType, SettingValueType } from '@/shared/types'

interface SettingParams {
    id: SettingIdType // Instead of standard ID
    value: SettingValueType
}

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
