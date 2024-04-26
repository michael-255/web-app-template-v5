import ExampleResult from '@/models/ExampleResult'
import { GroupEnum, SlugTableEnum, TableEnum } from '@/shared/enums'
import { exampleResultSchema } from '@/shared/schemas'
import type { z } from 'zod'
import ChildModelService from './_ChildModelService'

/**
 * The `ExampleResultService` handles database operations with the `ExampleResult` models.
 */
export default class ExampleResultService extends ChildModelService {
    static Model: typeof ExampleResult = ExampleResult
    static labelSingular: string = 'Example Result'
    static labelPlural: string = 'Example Results'
    static modelSchema: z.ZodSchema<any> = exampleResultSchema
    static table: TableEnum = TableEnum.EXAMPLE_RESULTS
    static slugTable: SlugTableEnum = SlugTableEnum.EXAMPLE_RESULTS
    static parentTable: TableEnum = TableEnum.EXAMPLES
    static group: GroupEnum = GroupEnum.CHILD
}
