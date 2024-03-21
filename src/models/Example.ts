import type { ParentModel } from '@/models/model-interfaces'
import type {
    NameType,
    OptionalTimestampType,
    ParentTagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'
import { uid } from 'quasar'

export default class Example implements ParentModel {
    constructor(
        public id: UUIDType = uid(),
        public createdAt: TimestampType = Date.now(),
        public name: NameType = 'My Example',
        public desc: TextAreaType = '',
        public tags: ParentTagsType = [],
        public lastChildCreatedAt: OptionalTimestampType = undefined,
        public lastChildNote: TextAreaType = '',
    ) {}
}
