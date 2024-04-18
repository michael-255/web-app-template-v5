import type { ParentModel } from '@/models/model-interfaces'
import { TagEnum } from '@/shared/enums'
import type {
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
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'My Example',
        desc = '',
        tags = [TagEnum.ENABLED],
        lastChildCreatedAt = undefined,
        lastChildNote = '',
    } = {}) {
        this.id = id
        this.createdAt = createdAt
        this.name = name
        this.desc = desc
        this.tags = tags
        this.lastChildCreatedAt = lastChildCreatedAt
        this.lastChildNote = lastChildNote
    }
}
