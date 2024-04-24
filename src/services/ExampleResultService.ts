import ExampleResult from '@/models/ExampleResult'
import ModelService from '@/services/_ModelService'
import { GroupEnum, TableEnum } from '@/shared/enums'
import { exampleResultSchema } from '@/shared/schemas'
import type { z } from 'zod'

/**
 * @TODO
 */
export default class ExampleResultService extends ModelService {
    static Model: typeof ExampleResult = ExampleResult
    static labelSingular: string = 'Example Result'
    static labelPlural: string = 'Example Results'
    static schema: z.ZodSchema<any> = exampleResultSchema
    static table: TableEnum = TableEnum.EXAMPLE_RESULTS
    static parentTable: TableEnum = TableEnum.EXAMPLES
    static group: GroupEnum = GroupEnum.CHILD
}
