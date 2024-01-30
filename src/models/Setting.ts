import { TableColumn, Type } from '@/shared'

export class Setting {
    key: Type.SettingKey
    value: Type.SettingValue

    // Types are enough to validate these args without needing to use Zod schemas
    constructor(key: Type.SettingKey, value: Type.SettingValue) {
        this.key = key
        this.value = value
    }

    /**
     * Displayable label for this model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Setting' : 'Settings'
    }

    /**
     * What model information is visible in the data table and in what order
     */
    static getTableColumns() {
        return [TableColumn.keyColumn, TableColumn.valueColumn]
    }
}
