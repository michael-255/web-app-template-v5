import type {
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
}

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: ParentTagsType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType
}

export interface ChildModel extends BaseModel {
    parentId: UUIDType
    note: TextAreaType
    tags: ChildTagsType
}
