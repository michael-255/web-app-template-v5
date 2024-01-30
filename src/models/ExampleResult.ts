import { Schema, TableColumn, Type } from '@/shared'
import { uid } from 'quasar'

export class ExampleResult {
    id: Type.UUID
    createdAt: Type.CreatedAt
    configId: Type.UUID

    constructor({
        id = uid(),
        createdAt = Date.now(),
        configId = '',
    }: Partial<ExampleResult> = {}) {
        this.id = Schema.uuid.parse(id)
        this.createdAt = Schema.createdAt.parse(createdAt)
        this.configId = Schema.uuid.parse(configId)
    }

    /**
     * @todo Do I still need this if all pages are separate now???
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Result' : 'Example Results'
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
        return [TableColumn.hiddenIdColumn, TableColumn.idColumn, TableColumn.createdAtColumn]
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
