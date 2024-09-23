import { z } from 'zod'
import { exampleResultSchema } from './example-result'
import {
    idSchema,
    statusListSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from './shared'

//
// Model
//
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
