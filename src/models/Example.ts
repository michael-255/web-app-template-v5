import { FlagEnum, TableEnum } from '@/shared/enums'
import type { ExampleResultType } from '@/shared/types/example-result'
import type {
    FlagType,
    IdType,
    TextAreaType,
    TextLineType,
    TimestampType,
} from '@/shared/types/shared'
import { createId } from '@/shared/utils'
import type ExampleResult from './ExampleResult'

interface ExampleParams {
    id?: IdType
    createdAt?: TimestampType
    flags?: FlagType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: ExampleResult
}

/**
 * `Example` parent model.
 */
export default class Example {
    id: IdType
    createdAt: TimestampType
    flags: FlagType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: ExampleResultType

    constructor(params: ExampleParams) {
        this.id = params.id ?? createId(TableEnum.EXAMPLES)
        this.createdAt = params.createdAt ?? Date.now()
        this.flags = params.flags ?? [FlagEnum.ENABLED]
        this.name = params.name ?? 'My Example'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
    }
}
