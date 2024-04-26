import Example from '@/models/Example'
import { GroupEnum, SlugTableEnum, TableEnum } from '@/shared/enums'
import { exampleSchema } from '@/shared/schemas'
import type { z } from 'zod'
import ParentModelService from './_ParentModelService'

/**
 * The `ExampleService` handles database operations with the `Example` models.
 */
export default class ExampleService extends ParentModelService {
    static Model: typeof Example = Example
    static labelSingular: string = 'Example'
    static labelPlural: string = 'Examples'
    static modelSchema: z.ZodSchema<any> = exampleSchema
    static table: TableEnum = TableEnum.EXAMPLES
    static slugTable: SlugTableEnum = SlugTableEnum.EXAMPLES
    static childTable: TableEnum = TableEnum.EXAMPLE_RESULTS
    static group: GroupEnum = GroupEnum.PARENT
}
