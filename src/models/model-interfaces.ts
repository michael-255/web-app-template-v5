import type {
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

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: TagsType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType
}

export interface ChildModel extends BaseModel {
    parentId: UUIDType
    note: TextAreaType
    tags: TagsType
}
