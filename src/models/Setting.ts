import { type SettingIdEnum } from '@/shared/enums'
import type { SettingValueType } from '@/shared/types'

/**
 * Application `Setting` model.
 *
 * This model is used for app wide settings. They are initialized and live queried during startup
 * and stored in the `SettingsStore` for easy access.
 */
export default class Setting {
    id: SettingIdEnum
    value: SettingValueType

    constructor({ id, value }: { id: SettingIdEnum; value: SettingValueType }) {
        this.id = id
        this.value = value
    }
}
