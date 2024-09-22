import { TableEnum, TagEnum } from '@/shared/enums'
import type {
    ExampleResultType,
    IdType,
    NameType,
    TagType,
    TextAreaType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'
import type ExampleResult from './ExampleResult'

interface ExampleParams {
    id?: IdType
    createdAt?: TimestampType
    tags?: TagType[]
    name?: NameType
    desc?: TextAreaType
    lastChild?: ExampleResult
}

/**
 * `Example` parent model.
 */
export default class Example {
    id: IdType
    createdAt: TimestampType
    tags: TagType[]
    name: NameType
    desc: TextAreaType
    lastChild?: ExampleResultType

    constructor(params: ExampleParams) {
        this.id = params.id ?? createId(TableEnum.EXAMPLES)
        this.createdAt = params.createdAt ?? Date.now()
        this.tags = params.tags ?? [TagEnum.ENABLED]
        this.name = params.name ?? 'My Example'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
    }
}
