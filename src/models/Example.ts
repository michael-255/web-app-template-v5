import { TableEnum } from '@/shared/enums'
import type {
    ExampleResultType,
    IdType,
    StatusType,
    TextAreaType,
    TextLineType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

interface ExampleParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    name?: TextLineType
    desc?: TextAreaType
    lastChild?: ExampleResultType
}

//
// Model
//

/**
 * `Example` parent model.
 */
export class Example {
    id: IdType
    createdAt: TimestampType
    status: StatusType[]
    name: TextLineType
    desc: TextAreaType
    lastChild?: ExampleResultType

    constructor(params: ExampleParams) {
        this.id = params.id ?? createId(TableEnum.EXAMPLES)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? []
        this.name = params.name ?? 'My Example'
        this.desc = params.desc ?? ''
        this.lastChild = params.lastChild ?? undefined
    }
}
