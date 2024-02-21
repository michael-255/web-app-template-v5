import type { ModelMethods } from '@/models/model-interfaces'
import { settingKeySchema, settingSchema, settingValueSchema } from '@/shared/schemas'
import type { SettingKeyType, SettingValueType } from '@/shared/types'

export default class Setting implements ModelMethods {
    key: SettingKeyType
    value: SettingValueType

    constructor(key: SettingKeyType, value: SettingValueType) {
        this.key = settingKeySchema.parse(key)
        this.value = settingValueSchema.parse(value)
    }

    /**
     * Validate the model using it's Zod schema
     */
    isValid(): boolean {
        return settingSchema.safeParse(this).success
    }
}
