import type { DatabaseTables } from '@/services/Database'
import type { GroupEnum, TableEnum } from '@/shared/enums'
import { baseSchema } from '@/shared/schemas'
import type { DBRecordType, IdType, TimestampType } from '@/shared/types'

export default abstract class Base {
    id: IdType
    createdAt: TimestampType

    constructor({ id, createdAt }: { id: IdType; createdAt: TimestampType }) {
        this.id = id
        this.createdAt = createdAt
    }

    static label(table: TableEnum, style: 'singular' | 'plural' = 'singular'): string {
        throw new Error('Not supported in Base class')
    }

    static schema() {
        return baseSchema
    }

    static table(): TableEnum {
        throw new Error('Not supported in Base class')
    }

    static parentTable(): TableEnum {
        throw new Error('Not supported in Base class')
    }

    static childTable(): TableEnum {
        throw new Error('Not supported in Base class')
    }

    static group(): GroupEnum {
        throw new Error('Not supported in Base class')
    }

    static async getAll(db: DatabaseTables) {
        return await db.table(this.table()).toArray()
    }

    static async getRecord(db: DatabaseTables, id: IdType): Promise<DBRecordType> {
        const recordToGet = await db.table(this.table()).get(id)
        if (!recordToGet) {
            throw new Error(`Record not found: ${id}`)
        }
        return recordToGet!
    }

    static async addRecord(db: DatabaseTables, model: DBRecordType): Promise<DBRecordType> {
        const validatedModel = this.schema().parse(model)
        await db.table(this.table()).add(validatedModel)
        return validatedModel
    }

    static async putRecord(db: DatabaseTables, model: DBRecordType): Promise<DBRecordType> {
        const validatedModel = this.schema().parse(model)
        await db.table(this.table()).put(validatedModel)
        return validatedModel
    }

    static async deleteRecord(db: DatabaseTables, id: IdType): Promise<DBRecordType> {
        const recordToDelete = await db.table(this.table()).get(id)
        if (!recordToDelete) {
            throw new Error(`Record not found: ${id}`)
        }
        await db.table(this.table()).delete(id)
        return recordToDelete
    }

    static async importTable(db: DatabaseTables, table: TableEnum, records: DBRecordType[]) {
        throw new Error('Not implemented')
    }

    static async exportTable(db: DatabaseTables, table: TableEnum) {
        throw new Error('Not implemented')
    }

    static async clearTable(db: DatabaseTables, table: TableEnum) {
        return await db.table(table).clear()
    }

    static async getTableOptions(db: DatabaseTables, table: TableEnum) {
        const records = await db.table(table).toArray()
        return records.map((r: DBRecordType) => ({
            value: r.id as IdType,
            label: r.id as IdType,
            disable: false,
        }))
    }
}
