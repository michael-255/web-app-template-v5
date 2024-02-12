import { createdAtSchema, descSchema, nameSchema, tagsSchema, uuidSchema } from '@/shared/schemas'
import type { CreatedAtType, DescType, NameType, TagsType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleConfig {
    id: UUIDType
    createdAt: CreatedAtType
    name: NameType
    desc: DescType
    tags: TagsType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'Example',
        desc = '',
        tags = [],
    }: Partial<ExampleConfig> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.name = nameSchema.parse(name)
        this.desc = descSchema.parse(desc)
        this.tags = tagsSchema.parse(tags)
    }
}
