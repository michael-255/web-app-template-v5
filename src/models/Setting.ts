import type { SettingKey } from '@/shared/enums'

export class Setting {
    constructor(
        public key: SettingKey,
        public value: any,
    ) {}

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }
}
