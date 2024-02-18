import type {
    BooleanType,
    CreatedAtType,
    NameType,
    TagsType,
    TextAreaType,
    UUIDType,
} from '@/shared/types'

export interface BaseModel {
    id: UUIDType
    createdAt: CreatedAtType
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
