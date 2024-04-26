import BaseModelService from '@/services/abstract/BaseModelService'
import type { Database } from '@/services/db'
import { GroupEnum, TagEnum } from '@/shared/enums'
import type { IdType, ModelType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery } from 'dexie'

/**
 * The `ParentModelService` is for `Services` to extend if they handle database operations with
 * parent models that are the target of a many-to-one relationship with child models.
 */
export default abstract class ParentModelService extends BaseModelService {
    group: GroupEnum = GroupEnum.PARENT

    /**
     * Returns live query with records that are not enabled filtered out and the remaining sorted
     * alphabetically by name with favorited records given priority.
     */
    liveDashboard(db: Database) {
        return liveQuery(() =>
            db
                .table(this.table)
                .orderBy('name')
                .filter((r) => r.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((records) =>
                    records.sort((a, b) => {
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
     * Returns all records in the table sorted alphabetically by name.
     */
    async getAll(db: Database) {
        return await db.table(this.table).orderBy('name').toArray()
    }

    /**
     * Removes the parent record by id and all it's associated child records from the database.
     */
    async delete(db: Database, id: IdType): Promise<ModelType> {
        const recordToDelete = await db.table(this.table).get(id)
        await db.transaction('rw', db.table(this.parentTable), db.table(this.table), async () => {
            await db.table(this.table).delete(id)
            await db.table(this.childTable).where('parentId').equals(id).delete()
        })
        return recordToDelete
    }

    /**
     * Removes data and fields that are not needed for backups.
     */
    clean(records: ModelType[]) {
        return records.map((r) => {
            if ('lastChild' in r) {
                delete r.lastChild
            }
            return r
        })
    }

    /**
     * Exports records from the table using getAll and cleans them before returning.
     */
    async export(db: Database) {
        return this.clean(await this.getAll(db))
    }

    /**
     * From Parent:
     *
     * Updates the `lastChild` property of the parent model associated with the `parentId` with the
     * most recently created child model.
     */
    async updateLastChild(db: Database, parentId: IdType) {
        const lastChild = (
            await db.table(this.childTable).where('parentId').equals(parentId).sortBy('createdAt')
        )
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(this.table).update(parentId, { lastChild })
    }

    /**
     * Toggles the favorited tag on the parent model's tags property.
     */
    async toggleFavorite(db: Database, record: ModelType) {
        const index = record.tags.indexOf(TagEnum.FAVORITED)
        if (index === -1) {
            record.tags.push(TagEnum.FAVORITED)
        } else {
            record.tags.splice(index, 1)
        }
        await db.table(this.table).update(record.id, { tags: record.tags })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    async getSelectOptions(db: Database): Promise<SelectOption[]> {
        const records = await this.getAll(db)
        return records.map((r: ModelType) => ({
            value: r.id as IdType,
            label: `${r.name} (${truncateText(r.id, 8, '*')})`,
            disable: r.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }
}
