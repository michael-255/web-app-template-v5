import type {
    BooleanType,
    NameType,
    OptionalTimestampType,
    TagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'

export interface BaseModel {
    id: UUIDType
    createdAt: TimestampType
}

export interface ParentModel {
    name: NameType
    desc: TextAreaType
    tags: TagsType
    activated: BooleanType
    favorited: BooleanType
    enabled: BooleanType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType
}

export interface ChildModel {
    note: TextAreaType
    activated: BooleanType
    skipped: BooleanType
}
