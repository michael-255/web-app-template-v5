import type { SettingKeyType, SettingValueType } from '@/shared/types'

export default class Setting {
    key: SettingKeyType
    value: SettingValueType

    // Types are enough to validate these args without needing to use Zod schemas
    constructor(key: SettingKeyType, value: SettingValueType) {
        this.key = key
        this.value = value
    }
}
