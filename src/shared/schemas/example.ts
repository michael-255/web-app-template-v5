import { z } from 'zod'
import { exampleResultSchema } from './example-result'
import { flagListSchema, idSchema, textAreaSchema, textLineSchema, timestampSchema } from './shared'

//
// Model
//
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    flags: flagListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
