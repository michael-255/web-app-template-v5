import { createId } from '@/shared/db-utils'
import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'

/**
 * @TODO
 */
export default class ExampleResult {
    id: IdType
    createdAt: TimestampType
    tags: TagEnum[]
    parentId: IdType
    note: TextAreaType

    constructor({
        id,
        createdAt,
        tags,
        parentId,
        note,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagEnum[]
        parentId: IdType
        note?: TextAreaType
    }) {
        this.id = id ?? createId(TableEnum.EXAMPLE_RESULTS)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? []
        this.parentId = parentId
        this.note = note ?? ''
    }
}
