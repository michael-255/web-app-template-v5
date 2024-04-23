import Base from '@/models/_Base'
import { type TagEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'

export default class Child extends Base {
    parentId: IdType
    note: TextAreaType
    tags: TagEnum[]

    constructor({
        id,
        createdAt,
        parentId,
        note,
        tags,
    }: {
        id: IdType
        createdAt: TimestampType
        parentId: IdType
        note: TextAreaType
        tags: TagEnum[]
    }) {
        super({ id, createdAt })
        if (!parentId) {
            throw new Error('Child record must have a parentId')
        }
        this.parentId = parentId
        this.note = note
        this.tags = tags
    }
}
