import { z } from 'zod'
import type { exampleResultSchema, mockDataSchema } from '../schemas/example-result'

//
// Fields
//
export type MockDataType = z.infer<typeof mockDataSchema>

//
// Model
//
export type ExampleResultType = z.infer<typeof exampleResultSchema>
