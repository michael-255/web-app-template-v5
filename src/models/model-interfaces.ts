import type {
    BooleanType,
    NameType,
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
}

export interface ChildModel {
    notes: TextAreaType
    activated: BooleanType
    skipped: BooleanType
}
