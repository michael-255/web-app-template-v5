import type { ParentModel } from '@/models/model-interfaces'
import type {
    BooleanType,
    NameType,
    OptionalTimestampType,
    TagsType,
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
        public tags: TagsType = [],
        public locked: BooleanType = false,
        public favorited: BooleanType = false,
        public enabled: BooleanType = true,
        public lastChildCreatedAt: OptionalTimestampType = undefined,
        public lastChildNote: TextAreaType = '',
    ) {}
}
