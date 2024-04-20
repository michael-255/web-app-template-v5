import type { TagEnum } from '@/shared/enums'
import type { IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'

export interface BaseModel {
    id: IdType
    createdAt: TimestampType
}

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: TagEnum[]
}

export interface ChildModel extends BaseModel {
    parentId: IdType
    note: TextAreaType
    tags: TagEnum[]
}
