import { Schema, Type } from '@/shared'
import { uid } from 'quasar'

export class Example {
    id: Type.UUID
    createdAt: Type.CreatedAt
    name: Type.Name
    desc: Type.Desc
    tags: Type.Tags
    data: Type.Data

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
