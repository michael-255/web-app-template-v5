import { Type } from '@/shared'

export class Setting {
    key: Type.SettingKey
    value: Type.SettingValue

    // Types are enough to validate these args without needing to use Zod schemas
    constructor(key: Type.SettingKey, value: Type.SettingValue) {
        this.key = key
        this.value = value
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
