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
    name: NameType
    desc: TextAreaType
    tags: TagsType
    activated: BooleanType
    favorited: BooleanType
    enabled: BooleanType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'Example',
        desc = '',
        tags = [],
        activated = false,
        favorited = false,
        enabled = true,
        lastChildCreatedAt = undefined,
        lastChildNote = '',
    }: Partial<Example> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.name = nameSchema.parse(name)
        this.desc = textAreaSchema.parse(desc)
        this.tags = tagsSchema.parse(tags)
        this.activated = booleanSchema.parse(activated)
        this.favorited = booleanSchema.parse(favorited)
        this.enabled = booleanSchema.parse(enabled)
        this.lastChildCreatedAt = optionalTimestampSchema.parse(lastChildCreatedAt)
        this.lastChildNote = textAreaSchema.parse(lastChildNote)
    }

    /**
     * Displayable label for this model
     */
    getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example' : 'Examples'
    }
}
