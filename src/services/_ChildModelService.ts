import { GroupEnum, TagEnum } from '@/shared/enums'
import type { IdType, ModelType } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import BaseModelService from './_BaseModelService'
import type { Database } from './db'

/**
 * The `ChildModelService` is for `Services` to extend if they handle database operations with child
 * models that have a relationship with a single parent model.
 */
export default abstract class ChildModelService extends BaseModelService {
    static group: GroupEnum = GroupEnum.CHILD

    /**
     * @todo
     */
    static async getAll(db: Database) {
        return await db.table(this.table).orderBy('createdAt').reverse().toArray()
    }

    /**
     * @todo
     */
    static async add(db: Database, model: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(model)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).add(validatedModel)
            await this.updateLastChild(db, validatedModel.parentId)
        })
        return validatedModel
    }

    /**
     * @todo
     */
    static async put(db: Database, model: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(model)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).put(validatedModel)
            await this.updateLastChild(db, validatedModel.parentId)
        })
        return validatedModel
    }

    /**
     * @todo
     */
    static async delete(db: Database, id: IdType): Promise<ModelType> {
        const recordToDelete = await db.table(this.table).get(id)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            // Delete child record
            await db.table(this.table).delete(id)
            // Update parent record last child
            await this.updateLastChild(db, recordToDelete.parentId)
        })
        return recordToDelete
    }

    /**
     * @TODO
     */
    static async import(db: Database, models: ModelType[]) {
        const { validModels, skippedModels } = this.validate(models)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).bulkAdd(validModels)
            await this.updateLastChild(db, validModels[0].parentId)
        })
        return skippedModels
    }

    /**
     * From Child model: Updates the `lastChild` property of the parent model associated with the
     * `parentId` with the most recently created child model.
     */
    static async updateLastChild(db: Database, parentId: IdType) {
        const lastChild = (
            await db.table(this.table).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((m) => !m.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(this.parentTable).update(parentId, { lastChild })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    static async getSelectOptions(db: Database) {
        const models = await this.getAll(db)
        return models.map((m: ModelType) => ({
            value: m.id as IdType,
            label: `${truncateText(m.id, 8, '*')} (${truncateText(m.parentId, 8, '*')})`,
            disable: m.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }
}
