import type { NameType, TagsType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'

export interface BaseModel {
    id: UUIDType
    createdAt: TimestampType
}

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: TagsType
}

export interface ChildModel extends BaseModel {
    parentId: UUIDType
    note: TextAreaType
    tags: TagsType
}
