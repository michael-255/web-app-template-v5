import { z } from 'zod'
import { flagListSchema, idSchema, textAreaSchema, timestampSchema } from './shared'

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
    flags: flagListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})
