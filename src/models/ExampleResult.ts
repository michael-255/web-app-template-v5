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

    constructor({
        id = uid(),
        createdAt = Date.now(),
        parentId = '', // Invalid placeholder must be replaced with actual parent ID in app
        note = '',
        tags = [],
    } = {}) {
        this.id = id
        this.createdAt = createdAt
        this.parentId = parentId
        this.note = note
        this.tags = tags
    }
}
