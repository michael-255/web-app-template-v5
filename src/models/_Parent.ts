import Base from '@/models/_Base'
import { type TagEnum } from '@/shared/enums'
import type { DBRecordType, IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'

export default class Parent extends Base {
    name: NameType
    desc: TextAreaType
    tags: TagEnum[]
    lastChild?: DBRecordType

    constructor({
        id,
        createdAt,
        name,
        desc,
        tags,
        lastChild,
    }: {
        id: IdType
        createdAt: TimestampType
        name: NameType
        desc: TextAreaType
        tags: TagEnum[]
        lastChild?: DBRecordType
    }) {
        super({ id, createdAt })
        this.name = name
        this.desc = desc
        this.tags = tags
        this.lastChild = lastChild
    }
}
