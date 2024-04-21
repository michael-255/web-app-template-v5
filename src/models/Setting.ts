import type { SettingIdEnum } from '@/shared/enums'
import type { SettingValueType } from '@/shared/types'

export default class Setting {
    id: SettingIdEnum
    value: SettingValueType

    constructor(id: SettingIdEnum, value: SettingValueType) {
        this.id = id
        this.value = value
    }
}
