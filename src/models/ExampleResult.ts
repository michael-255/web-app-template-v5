import type { ChildModel } from '@/models/model-interfaces'
import type { ChildTagsType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    id: UUIDType
    createdAt: TimestampType
    parentId: UUIDType
    note: TextAreaType
    tags: ChildTagsType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        parentId = 'Invalid Id',
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
