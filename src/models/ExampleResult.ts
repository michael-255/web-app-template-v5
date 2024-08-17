import { TableEnum } from '@/shared/enums'
import type { ChildTagType, IdType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

/**
 * `ExampleResult` child model.
 */
export default class ExampleResult {
    id: IdType
    createdAt: TimestampType
    tags: ChildTagType[]
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
        tags?: ChildTagType[]
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
