import {
    booleanSchema,
    createdAtSchema,
    nameSchema,
    tagsSchema,
    textAreaSchema,
    uuidSchema,
} from '@/shared/schemas'
import type {
    BooleanType,
    CreatedAtType,
    NameType,
    TagsType,
    TextAreaType,
    UUIDType,
} from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleConfig {
    id: UUIDType
    createdAt: CreatedAtType
    name: NameType
    desc: TextAreaType
    tags: TagsType
    favorited: BooleanType
    enabled: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'Example',
        desc = '',
        tags = [],
        favorited = false,
        enabled = true,
    }: Partial<ExampleConfig> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.name = nameSchema.parse(name)
        this.desc = textAreaSchema.parse(desc)
        this.tags = tagsSchema.parse(tags)
        this.favorited = booleanSchema.parse(favorited)
        this.enabled = booleanSchema.parse(enabled)
    }
}
