import { Schema, Type } from '@/shared'

export class Setting {
    key: Type.SettingKey
    value: Type.SettingValue

    constructor(key: Type.SettingKey, value: Type.SettingValue) {
        this.key = Schema.settingKey.parse(key)
        this.value = Schema.settingValue.parse(value)
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
