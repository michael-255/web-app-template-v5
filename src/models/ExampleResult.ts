import { TableEnum } from '@/shared/enums'
import { idSchema, statusListSchema, textAreaSchema, timestampSchema } from '@/shared/schemas'
import type { IdType, StatusType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import { z } from 'zod'

//
// Schemas
//

export const mockDataSchema = z.number()

export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})

//
// Types
//

export type MockDataType = z.infer<typeof mockDataSchema>
export type ExampleResultType = z.infer<typeof exampleResultSchema>

interface ExampleResultParams {
    id?: IdType
    createdAt?: TimestampType
    status?: StatusType[]
    parentId: IdType // Parent reference required, never defaulted
    note?: TextAreaType
    mockData?: MockDataType
}

/**
 * `ExampleResult` child model.
 */
export default class ExampleResult {
    id: IdType
    createdAt: TimestampType
    status: StatusType[]
    parentId: IdType
    note: TextAreaType
    mockData: MockDataType

    constructor(params: ExampleResultParams) {
        this.id = params.id ?? createId(TableEnum.EXAMPLE_RESULTS)
        this.createdAt = params.createdAt ?? Date.now()
        this.status = params.status ?? []
        this.parentId = params.parentId // Parent reference required, never defaulted
        this.note = params.note ?? ''
        // Mock data is a random number between -100 and 100
        this.mockData = params.mockData ?? Math.floor(Math.random() * 200) - 100
    }
}
