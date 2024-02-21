import type { ModelMethods } from '@/models/model-interfaces'
import { settingKeySchema, settingSchema, settingValueSchema } from '@/shared/schemas'
import type { SettingKeyType, SettingValueType } from '@/shared/types'
import { tableColumn } from '@/shared/utils'
import type { QTableColumn } from 'quasar'

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

    /**
     * Displayable labels for the model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }

    /**
     * @TODO
     */
    static getTableColumns(): QTableColumn[] {
        return [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
    }
}
