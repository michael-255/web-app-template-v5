import type { IdType, SettingValueType } from '@/shared/types'

export default class Setting {
    id: IdType
    value: SettingValueType

    constructor(id: IdType, value: SettingValueType) {
        this.id = id
        this.value = value
    }
}
