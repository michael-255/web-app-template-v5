import { settingKeySchema, settingValueSchema } from '@/shared/schemas'
import type { SettingKeyType, SettingValueType } from '@/shared/types'

export default class Setting {
    key: SettingKeyType
    value: SettingValueType

    constructor(key: SettingKeyType, value: SettingValueType) {
        this.key = settingKeySchema.parse(key)
        this.value = settingValueSchema.parse(value)
    }

    /**
     * Displayable label for this model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
