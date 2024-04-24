import { type SettingIdEnum } from '@/shared/enums'
import type { SettingValueType } from '@/shared/types'

/**
 * @TODO
 */
export default class Setting {
    id: SettingIdEnum
    value: SettingValueType

    constructor({ id, value }: { id: SettingIdEnum; value: SettingValueType }) {
        this.id = id
        this.value = value
    }
}
