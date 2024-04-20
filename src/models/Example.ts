import type { ParentModel } from '@/models/model-interfaces'
import { TagEnum } from '@/shared/enums'
import type { IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'
import { uid } from 'quasar'
import type ExampleResult from './ExampleResult'

export default class Example implements ParentModel {
    id: IdType
    createdAt: TimestampType
    name: NameType
    desc: TextAreaType
    tags: TagEnum[]
    lastChild?: ExampleResult

    constructor(id: IdType = uid()) {
        this.id = id
        this.createdAt = Date.now()
        this.name = 'My Example'
        this.desc = ''
        this.tags = [TagEnum.ENABLED]
        this.lastChild = undefined
    }
}
