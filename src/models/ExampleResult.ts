import type { ChildModel } from '@/models/model-interfaces'
import { createId } from '@/shared/db-utils'
import { TableEnum, type TagEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'

export default class ExampleResult implements ChildModel {
    id: IdType
    createdAt: TimestampType
    parentId: IdType
    note: TextAreaType
    tags: TagEnum[]

    constructor(parentId: IdType) {
        this.id = createId(TableEnum.EXAMPLE_RESULTS)
        this.createdAt = Date.now()
        this.parentId = parentId
        this.note = ''
        this.tags = []
    }
}
