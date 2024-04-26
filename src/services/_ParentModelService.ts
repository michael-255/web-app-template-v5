import { GroupEnum, TagEnum } from '@/shared/enums'
import type { IdType, ModelType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery } from 'dexie'
import BaseModelService from './_BaseModelService'
import type { Database } from './db'

/**
 * The `ParentModelService` is for `Services` to extend if they handle database operations with
 * parent models that are the target of a many-to-one relationship with child models.
 */
export default abstract class ParentModelService extends BaseModelService {
    static group: GroupEnum = GroupEnum.PARENT

    /**
     * @todo
     */
    static async getAll(db: Database) {
        return await db.table(this.table).orderBy('name').toArray()
    }

    /**
     * Dashboard live query return records with those that are not enabled filtered out and the
     * remaining sorted alphabetically by name. Favorited records will be sorted to the top of the
     * list.
     */
    static liveDashboard(db: Database) {
        return liveQuery(() =>
            db
                .table(this.table)
                .orderBy('name')
                .filter((m) => m.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((models) =>
                    models.sort((a, b) => {
                        const aIsFavorited = a.tags.includes(TagEnum.FAVORITED)
                        const bIsFavorited = b.tags.includes(TagEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        } else if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        } else {
                            // If both or neither are favorited, sort alphabetically by name
                            return a.name.localeCompare(b.name)
                        }
                    }),
                ),
        )
    }

    /**
     * @todo
     */
    static async delete(db: Database, id: IdType): Promise<ModelType> {
        const recordToDelete = await db.table(this.table).get(id)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            // Delete parent record
            await db.table(this.table).delete(id)
            // Delete associated child records
            await db.table(this.childTable).where('parentId').equals(id).delete()
        })
        return recordToDelete
    }

    /**
     * Remove data and fields that are not needed for storing the data as a backup.
     */
    static clean(models: ModelType[]) {
        return models.map((m) => {
            if ('lastChild' in m) {
                delete m.lastChild
            }
            return m
        })
    }

    static async export(db: Database) {
        return this.clean(await this.getAll(db))
    }

    /**
     * From Parent model: Updates the `lastChild` property of the parent model associated with the
     * `parentId` with the most recently created child model.
     */
    static async updateLastChild(db: Database, parentId: IdType) {
        const lastChild = (
            await db.table(this.childTable).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((m) => !m.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(this.table).update(parentId, { lastChild })
    }

    /**
     * Toggles the FAVORITED tag on the parent model's tags property.
     */
    static async toggleFavorite(db: Database, model: ModelType) {
        const index = model.tags.indexOf(TagEnum.FAVORITED)
        if (index === -1) {
            model.tags.push(TagEnum.FAVORITED)
        } else {
            model.tags.splice(index, 1)
        }
        await db.table(this.table).update(model.id, { tags: model.tags })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    static async getSelectOptions(db: Database): Promise<SelectOption[]> {
        const models = await this.getAll(db)
        return models.map((m: ModelType) => ({
            value: m.id as IdType,
            label: `${m.name} (${truncateText(m.id, 8, '*')})`,
            disable: m.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }
}
