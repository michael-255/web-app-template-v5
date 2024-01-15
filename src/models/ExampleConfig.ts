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

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Config' : 'Example Configs'
    }

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
}
