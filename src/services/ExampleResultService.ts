import ExampleResult from '@/models/ExampleResult'
import type Setting from '@/models/Setting'
import ChildModelService from '@/services/abstract/ChildModelService'
import { SlugTableEnum, TableEnum } from '@/shared/enums'
import { exampleResultSchema } from '@/shared/schemas'
import type { ModelType } from '@/shared/types'
import type { Observable } from 'dexie'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `ExampleResultService` handles database operations with the `ExampleResult` models.
 */
export class ExampleResultService extends ChildModelService {
    private static _instance: ExampleResultService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): ExampleResultService {
        if (!ExampleResultService._instance) {
            ExampleResultService._instance = new ExampleResultService()
        }
        return ExampleResultService._instance
    }

    Model: typeof ExampleResult = ExampleResult
    labelSingular: string = 'Example Result'
    labelPlural: string = 'Example Results'
    modelSchema: z.ZodSchema<any> = exampleResultSchema
    table: TableEnum = TableEnum.EXAMPLE_RESULTS
    slugTable: SlugTableEnum = SlugTableEnum.EXAMPLE_RESULTS
    parentTable: TableEnum = TableEnum.EXAMPLES
    childTable: TableEnum = null!

    // eslint-disable-next-line
    liveDashboard(db: Database): Observable<ModelType[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    clean(models: ModelType[]): ModelType[] {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    toggleFavorite(db: Database, model: ModelType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

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
export default ExampleResultService.getSingleton()
