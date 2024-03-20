import type { ChildModel } from '@/models/model-interfaces'
import type {
    BooleanType,
    ChildTagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    constructor(
        public id: UUIDType = uid(),
        public createdAt: TimestampType = Date.now(),
        public parentId: UUIDType = '',
        public note: TextAreaType = '',
        public tags: ChildTagsType = [],
        public locked: BooleanType = false, // TODO: Remove this
        public skipped: BooleanType = false, // TODO: Remove this
    ) {}
}
