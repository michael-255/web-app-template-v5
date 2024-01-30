import { Schema, TableColumn, Type } from '@/shared'
import { uid } from 'quasar'

export class ExampleConfig {
    id: Type.UUID
    createdAt: Type.CreatedAt
    name: Type.Name
    desc: Type.Desc
    tags: Type.Tags

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = ExampleConfig.getLabel('singular'),
        desc = '',
        tags = [],
    }: Partial<ExampleConfig> = {}) {
        this.id = Schema.uuid.parse(id)
        this.createdAt = Schema.createdAt.parse(createdAt)
        this.name = Schema.name.parse(name)
        this.desc = Schema.desc.parse(desc)
        this.tags = Schema.tags.parse(tags)
    }

    /**
     * @todo Do I still need this if all pages are separate now???
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Config' : 'Example Configs'
    }

    /**
     * How model information will be presented during inspections and in what order
     */
    static getInspectionItems(): any[] {
        return []
    }

    /**
     * What model information is visible in the data table and in what order
     */
    static getTableColumns() {
        return [
            TableColumn.hiddenIdColumn,
            TableColumn.idColumn,
            TableColumn.createdAtColumn,
            TableColumn.nameColumn,
            TableColumn.descColumn,
            TableColumn.tagsColumn,
        ]
    }

    /**
     * Only table columns that are required will not be togglable in the UI (hidden columns)
     */
    static getColumnOptions() {
        return this.getTableColumns().filter((col) => !col.required)
    }

    /**
     * What column options are visiable on the data table (based on getColumnOptions)
     */
    static getVisibleColumns() {
        return this.getColumnOptions().map((col) => col.name)
    }
}
