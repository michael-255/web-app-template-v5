import type { ParentModel } from '@/models/model-interfaces'
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

export default class Example implements ParentModel {
    id: UUIDType
    createdAt: TimestampType
    name: NameType
    desc: TextAreaType
    tags: TagsType
    locked: BooleanType
    favorited: BooleanType
    enabled: BooleanType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'My Example',
        desc = '',
        tags = [],
        locked = false,
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
        this.locked = booleanSchema.parse(locked)
        this.favorited = booleanSchema.parse(favorited)
        this.enabled = booleanSchema.parse(enabled)
        this.lastChildCreatedAt = optionalTimestampSchema.parse(lastChildCreatedAt)
        this.lastChildNote = textAreaSchema.parse(lastChildNote)
    }
    isValid(): boolean {
        throw new Error('Method not implemented.')
    }
}
