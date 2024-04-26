import BaseModelService from '@/services/abstract/BaseModelService'
import type { Database } from '@/services/db'
import { GroupEnum, TagEnum } from '@/shared/enums'
import type { IdType, ModelType } from '@/shared/types'
import { truncateText } from '@/shared/utils'

/**
 * The `ChildModelService` is for `Services` to extend if they handle database operations with child
 * models that have a relationship with a single parent model.
 */
export default abstract class ChildModelService extends BaseModelService {
    group: GroupEnum = GroupEnum.CHILD

    /**
     * Returns all records in the table sorted by creation date in descending order.
     */
    async getAll(db: Database) {
        return await db.table(this.table).orderBy('createdAt').reverse().toArray()
    }

    /**
     * Creates a new child record and updates the parent record's `lastChild` property.
     */
    async add(db: Database, record: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(record)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).add(validatedModel)
            await this.updateLastChild(db, validatedModel.parentId)
        })
        return validatedModel
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async put(db: Database, record: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(record)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).put(validatedModel)
            await this.updateLastChild(db, validatedModel.parentId)
        })
        return validatedModel
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async delete(db: Database, id: IdType): Promise<ModelType> {
        const recordToDelete = await db.table(this.table).get(id)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).delete(id)
            await this.updateLastChild(db, recordToDelete.parentId)
        })
        return recordToDelete
    }

    /**
     * From Child:
     *
     * Updates the `lastChild` property of the parent model associated with the `parentId` with the
     * most recently created child model.
     */
    async updateLastChild(db: Database, parentId: IdType) {
        const lastChild = (
            await db.table(this.table).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(this.parentTable).update(parentId, { lastChild })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    async getSelectOptions(db: Database) {
        const records = await this.getAll(db)
        return records.map((r: ModelType) => ({
            value: r.id as IdType,
            label: `${truncateText(r.id, 8, '*')} (${truncateText(r.parentId, 8, '*')})`,
            disable: r.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }
}
