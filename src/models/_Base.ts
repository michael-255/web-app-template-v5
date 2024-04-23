import type { DatabaseApi } from '@/services/Database'
import type { IdType, TimestampType } from '@/shared/types'

export default class Base {
    id: IdType
    createdAt: TimestampType

    constructor({ id, createdAt }: { id: IdType; createdAt: TimestampType }) {
        this.id = id
        this.createdAt = createdAt
    }

    static getRecord(db: DatabaseApi, id: IdType) {
        return db.getRecord(id)
    }
}
