import { Enum, Schema } from '@/shared'

export class Setting {
    constructor(
        public key: Enum.SettingKey,
        public value: Schema.SettingValue,
    ) {}

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
