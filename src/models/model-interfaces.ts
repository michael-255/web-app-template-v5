import type {
    BooleanType,
    ChildTagsType,
    NameType,
    OptionalTimestampType,
    ParentTagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'

export interface BaseModel {
    id: UUIDType
    createdAt: TimestampType
    locked: BooleanType
}

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: ParentTagsType
    favorited: BooleanType // TODO: Remove this
    enabled: BooleanType // TODO: Remove this
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType
}

export interface ChildModel extends BaseModel {
    parentId: UUIDType
    note: TextAreaType
    tags: ChildTagsType
    skipped: BooleanType // TODO: Remove this
}
