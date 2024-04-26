import Example from '@/models/Example'
import type Setting from '@/models/Setting'
import ParentModelService from '@/services/abstract/ParentModelService'
import { SlugTableEnum, TableEnum } from '@/shared/enums'
import { exampleSchema } from '@/shared/schemas'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `ExampleService` handles database operations with the `Example` models.
 */
export class ExampleService extends ParentModelService {
    private static _instance: ExampleService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): ExampleService {
        if (!ExampleService._instance) {
            ExampleService._instance = new ExampleService()
        }
        return ExampleService._instance
    }

    Model: typeof Example = Example
    labelSingular: string = 'Example'
    labelPlural: string = 'Examples'
    modelSchema: z.ZodSchema<any> = exampleSchema
    table: TableEnum = TableEnum.EXAMPLES
    slugTable: SlugTableEnum = SlugTableEnum.EXAMPLES
    parentTable: TableEnum = null!
    childTable: TableEnum = TableEnum.EXAMPLE_RESULTS

    // eslint-disable-next-line
    purgeLogs(db: Database): Promise<number> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    initSettings(db: Database): Promise<Setting[]> {
        throw new Error('Not supported on this Service')
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default ExampleService.getSingleton()
