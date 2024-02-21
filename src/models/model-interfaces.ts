import type {
    BooleanType,
    NameType,
    OptionalTimestampType,
    TagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'

export interface ModelMethods {
    isValid(): boolean
}

export interface BaseModel extends ModelMethods {
    id: UUIDType
    createdAt: TimestampType
    locked: BooleanType
}

export interface ParentModel extends BaseModel {
    name: NameType
    desc: TextAreaType
    tags: TagsType
    favorited: BooleanType
    enabled: BooleanType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType
}

export interface ChildModel extends BaseModel {
    parentId: UUIDType
    note: TextAreaType
    skipped: BooleanType
}
