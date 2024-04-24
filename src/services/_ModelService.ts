import type { Database } from '@/services/Database'
import type { GroupEnum, TableEnum } from '@/shared/enums'
import type { DBRecordType, IdType } from '@/shared/types'
import { liveQuery } from 'dexie'
import type { z } from 'zod'

export default abstract class ModelService {
    static Model: any = undefined!
    static labelSingular: string = undefined!
    static labelPlural: string = undefined!
    static schema: z.ZodSchema<any> = undefined!
    static table: TableEnum = undefined!
    static parentTable: TableEnum = undefined!
    static childTable: TableEnum = undefined!
    static group: GroupEnum = undefined!

    /**
     * Standard live query returns all records in the table using the getAll method.
     */
    static liveTable(db: Database) {
        return liveQuery(() => this.getAll(db))
    }

    static async getAll(db: Database) {
        return await db.table(this.table).toArray()
    }

    static async get(db: Database, id: IdType): Promise<DBRecordType> {
        const recordToGet = await db.table(this.table).get(id)
        if (!recordToGet) {
            throw new Error(`Record not found: ${id}`)
        }
        return recordToGet!
    }

    static async add(db: Database, model: DBRecordType): Promise<DBRecordType> {
        const validatedModel = this.schema.parse(model)
        await db.table(this.table).add(validatedModel)
        return validatedModel
    }

    static async put(db: Database, model: DBRecordType): Promise<DBRecordType> {
        const validatedModel = this.schema.parse(model)
        await db.table(this.table).put(validatedModel)
        return validatedModel
    }

    static async delete(db: Database, id: IdType): Promise<DBRecordType> {
        const recordToDelete = await db.table(this.table).get(id)
        if (!recordToDelete) {
            throw new Error(`Record not found: ${id}`)
        }
        await db.table(this.table).delete(id)
        return recordToDelete
    }

    static async import(db: Database, table: TableEnum, records: DBRecordType[]) {
        throw new Error('Not implemented')
    }

    static async export(db: Database, table: TableEnum) {
        throw new Error('Not implemented')
    }

    static async clear(db: Database) {
        return await db.table(this.table).clear()
    }

    static async getTableOptions(db: Database) {
        const records = await db.table(this.table).toArray()
        return records.map((r: DBRecordType) => ({
            value: r.id as IdType,
            label: r.id as IdType,
            disable: false,
        }))
    }

    static toggleFavorite() {
        return false
    }
}
