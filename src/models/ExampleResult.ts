import type { ChildModel } from '@/models/model-interfaces'
import type { TagsType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    id: UUIDType
    createdAt: TimestampType
    parentId: UUIDType
    note: TextAreaType
    tags: TagsType

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
