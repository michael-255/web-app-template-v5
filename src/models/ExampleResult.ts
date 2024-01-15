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

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Result' : 'Example Results'
    }

    static getTableColumns() {
        return [TableColumn.hiddenIdColumn, TableColumn.idColumn, TableColumn.createdAtColumn]
    }
}
