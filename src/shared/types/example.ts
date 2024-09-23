import { z } from 'zod'
import type { exampleSchema } from '../schemas/example'

//
// Model
//
export type ExampleType = z.infer<typeof exampleSchema>
