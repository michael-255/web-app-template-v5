import Base from '@/models/_Base'
import type { SettingIdEnum } from '@/shared/enums'
import type { SettingValueType, TimestampType } from '@/shared/types'

export default class Setting extends Base {
    value: SettingValueType

    constructor({
        id,
        createdAt,
        value,
    }: {
        id: SettingIdEnum
        createdAt?: TimestampType
        value: SettingValueType
    }) {
        super({ id, createdAt: createdAt ?? Date.now() })
        this.value = value
    }
}
