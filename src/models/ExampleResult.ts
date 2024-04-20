import type { ChildModel } from '@/models/model-interfaces'
import type { TagEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    id: IdType
    createdAt: TimestampType
    parentId: IdType
    note: TextAreaType
    tags: TagEnum[]

    constructor(parentId: IdType) {
        this.id = uid()
        this.createdAt = Date.now()
        this.parentId = parentId
        this.note = ''
        this.tags = []
    }
}
