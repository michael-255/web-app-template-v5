import {
    booleanSchema,
    nameSchema,
    optionalTimestampSchema,
    tagsSchema,
    textAreaSchema,
    timestampSchema,
    uuidSchema,
} from '@/shared/schemas'
import type {
    BooleanType,
    NameType,
    OptionalTimestampType,
    TagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'
import { uid } from 'quasar'
import type { BaseModel, ParentModel } from './model-interfaces'

export default class Example implements BaseModel, ParentModel {
    id: UUIDType
    createdAt: TimestampType
    lastExampleResultAt: OptionalTimestampType
    name: NameType
    desc: TextAreaType
    tags: TagsType
    activated: BooleanType
    favorited: BooleanType
    enabled: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        lastExampleResultAt = undefined,
        name = 'Example',
        desc = '',
        tags = [],
        activated = false,
        favorited = false,
        enabled = true,
    }: Partial<Example> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.lastExampleResultAt = optionalTimestampSchema.parse(lastExampleResultAt)
        this.name = nameSchema.parse(name)
        this.desc = textAreaSchema.parse(desc)
        this.tags = tagsSchema.parse(tags)
        this.activated = booleanSchema.parse(activated)
        this.favorited = booleanSchema.parse(favorited)
        this.enabled = booleanSchema.parse(enabled)
    }

    /**
     * Displayable label for this model
     */
    getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example' : 'Examples'
    }
}
