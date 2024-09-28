import { TableEnum } from '@/shared/enums'
import {
    idSchema,
    statusListSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TextLineType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'
import { exampleResultSchema, type ExampleResultType } from './ExampleResult'

//
// Schemas
//

export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})

//
// Types
//

export type ExampleType = z.infer<typeof exampleSchema>

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
export default class Example {
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
