import type { ChildModel } from '@/models/model-interfaces'
import type { BooleanType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult implements ChildModel {
    constructor(
        public id: UUIDType = uid(),
        public createdAt: TimestampType = Date.now(),
        public parentId: UUIDType = '',
        public note: TextAreaType = '',
        public locked: BooleanType = false,
        public skipped: BooleanType = false,
    ) {}
}
