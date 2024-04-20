import type { ParentModel } from '@/models/model-interfaces'
import { TagEnum } from '@/shared/enums'
import type { NameType, TagsType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'
import type ExampleResult from './ExampleResult'

export default class Example implements ParentModel {
    id: UUIDType
    createdAt: TimestampType
    name: NameType
    desc: TextAreaType
    tags: TagsType
    lastChild?: ExampleResult

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'My Example',
        desc = '',
        tags = [TagEnum.ENABLED],
        lastChild = undefined,
    } = {}) {
        this.id = id
        this.createdAt = createdAt
        this.name = name
        this.desc = desc
        this.tags = tags
        this.lastChild = lastChild
    }
}
