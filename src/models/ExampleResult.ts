import type { ChildModel } from '@/models/model-interfaces'
import type { ChildTagsType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    constructor(
        public id: UUIDType = uid(),
        public createdAt: TimestampType = Date.now(),
        public parentId: UUIDType = 'Invalid Id',
        public note: TextAreaType = '',
        public tags: ChildTagsType = [],
    ) {}
}
