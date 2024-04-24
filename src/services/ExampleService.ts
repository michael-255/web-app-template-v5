import Example from '@/models/Example'
import ModelService from '@/services/_ModelService'
import { GroupEnum, TableEnum } from '@/shared/enums'
import { exampleSchema } from '@/shared/schemas'
import type { z } from 'zod'

/**
 * @TODO
 */
export default class ExampleService extends ModelService {
    static Model: typeof Example = Example
    static labelSingular: string = 'Example'
    static labelPlural: string = 'Examples'
    static schema: z.ZodSchema<any> = exampleSchema
    static table: TableEnum = TableEnum.EXAMPLES
    static childTable: TableEnum = TableEnum.EXAMPLE_RESULTS
    static group: GroupEnum = GroupEnum.PARENT
}
