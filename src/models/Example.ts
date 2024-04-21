import type ExampleResult from '@/models/ExampleResult'
import type { ParentModel } from '@/models/model-interfaces'
import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'

export default class Example implements ParentModel {
    id: IdType
    createdAt: TimestampType
    name: NameType
    desc: TextAreaType
    tags: TagEnum[]
    lastChild?: ExampleResult

    constructor(id: IdType = createId(TableEnum.EXAMPLES)) {
        this.id = id
        this.createdAt = Date.now()
        this.name = 'My Example'
        this.desc = ''
        this.tags = [TagEnum.ENABLED]
        this.lastChild = undefined
    }
}
