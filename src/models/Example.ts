import { Schema } from '@/shared'
import { uid } from 'quasar'

export class Example {
    id: Schema.UUID
    createdAt: Schema.CreatedAt
    name: Schema.Name
    desc: Schema.Desc
    tags: Schema.Tags
    data: Schema.Data

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = Example.getLabel('singular'),
        desc = '',
        tags = [],
        data = [],
    }: Partial<Example> = {}) {
        this.id = Schema.uuid.parse(id)
        this.createdAt = Schema.createdAt.parse(createdAt)
        this.name = Schema.name.parse(name)
        this.desc = Schema.desc.parse(desc)
        this.tags = Schema.tags.parse(tags)
        this.data = Schema.data.parse(data)
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example' : 'Examples'
    }
}
