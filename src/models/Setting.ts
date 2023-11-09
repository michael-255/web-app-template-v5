import { Schema } from '@/shared'

export class Setting {
    key: Schema.SettingKey
    value: Schema.SettingValue

    constructor(key: Schema.SettingKey, value: Schema.SettingValue) {
        this.key = Schema.settingKey.parse(key)
        this.value = Schema.settingValue.parse(value)
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
