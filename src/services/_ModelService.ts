import type { Database } from '@/services/Database'
import { TagEnum, type GroupEnum, type TableEnum } from '@/shared/enums'
import type { DBRecordType, IdType } from '@/shared/types'
import { liveQuery } from 'dexie'
import type { z } from 'zod'

/**
 * @TODO
 */
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

    // TODO - LiveDashboard on ParentServices?

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

    // TODO - Move to ChildService?
    static async updateLastChild(db: Database, parentId: IdType) {
        if ('lastChild' in this.Model) {
            const lastChild = (
                await db.table(this.table).where('parentId').equals(parentId).sortBy('createdAt')
            )
                .filter((r) => !r.tags.includes(TagEnum.LOCKED))
                .reverse()[0]
            await db.table(this.parentTable).update(parentId, { lastChild })
        }
    }

    static validateRecords(records: DBRecordType[]) {
        const validRecords: DBRecordType[] = []
        const skippedRecords: DBRecordType[] = []

        records.forEach((r) => {
            if (this.schema.safeParse(r).success) {
                validRecords.push(this.schema.parse(r)) // Clean record with parse
            } else {
                skippedRecords.push(r)
            }
        })

        return { validRecords, skippedRecords }
    }

    static async import(db: Database, records: DBRecordType[]) {
        const { validRecords, skippedRecords } = this.validateRecords(records)
        await db.table(this.table).bulkAdd(validRecords)
        return skippedRecords
    }

    // TODO - Move to Parent and Child Services and override export() to use it there?
    /**
     * Remove data and fields that are not needed for storing the data as a backup.
     */
    static cleanRecords(records: DBRecordType[]) {
        return records.map((r) => {
            if ('lastChild' in r) {
                delete r.lastChild
            }
            return r
        })
    }

    // TODO - Could just call `return await this.getAll(db)`
    static async export(db: Database) {
        return this.cleanRecords(await this.getAll(db))
    }

    static async clear(db: Database) {
        return await db.table(this.table).clear()
    }

    // TODO - Get rid of default implementation and only have one on Parent and Child Services?
    static async getSelectOptions(db: Database) {
        const records = await db.table(this.table).toArray()
        return records.map((r: DBRecordType) => ({
            value: r.id as IdType,
            label: r.id as IdType,
            disable: false,
        }))
    }

    // TODO - Implement on ParentService?
    static toggleFavorite() {
        return false
    }
}
