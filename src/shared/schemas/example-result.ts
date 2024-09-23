import { z } from 'zod'
import { idSchema, statusListSchema, textAreaSchema, timestampSchema } from './shared'

//
// Fields
//
export const mockDataSchema = z.number()

//
// Model
//
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})
