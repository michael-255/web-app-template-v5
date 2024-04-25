import ExampleResult from '@/models/ExampleResult'
import ModelService from '@/services/_ModelService'
import { GroupEnum, TableEnum } from '@/shared/enums'
import { exampleResultSchema } from '@/shared/schemas'
import type { DBRecordType } from '@/shared/types'
import type { z } from 'zod'
import type { Database } from './Database'

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

    /**
     * @TODO
     */
    static async import(db: Database, records: DBRecordType[]) {
        const { validRecords, skippedRecords } = this.validateRecords(records)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).bulkAdd(validRecords)
            await this.updateLastChild(db, validRecords[0].parentId)
        })
        return skippedRecords
    }
}
