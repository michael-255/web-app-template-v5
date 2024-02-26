import type { SettingKeyType, SettingValueType } from '@/shared/types'

export default class Setting {
    constructor(
        public key: SettingKeyType,
        public value: SettingValueType,
    ) {}
}
