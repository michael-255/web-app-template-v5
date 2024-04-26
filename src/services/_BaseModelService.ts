import type Setting from '@/models/Setting'
import type { Database } from '@/services/db'
import { GroupEnum, SlugTableEnum, type TableEnum } from '@/shared/enums'
import type { IdType, ModelType, SelectOption } from '@/shared/types'
import { liveQuery, type Observable } from 'dexie'
import type { z } from 'zod'

/**
 * The `BaseModelService` is for `Services` to extend if they handle database operations with
 * standalone models with no explicit releationship to any other model. This `Service` defines all
 * the default properties and methods extending `Services` may use or override.
 */
export default abstract class BaseModelService {
    static Model: ModelType = undefined!
    static labelSingular: string = undefined!
    static labelPlural: string = undefined!
    static modelSchema: z.ZodSchema<any> = undefined!
    static table: TableEnum = undefined!
    static slugTable: SlugTableEnum = undefined!
    static parentTable: TableEnum = undefined!
    static childTable: TableEnum = undefined!
    static group: GroupEnum = GroupEnum.STANDALONE

    /**
     * Standard live query returns all records in the table using the getAll method.
     */
    static liveTable(db: Database) {
        return liveQuery(() => this.getAll(db))
    }

    /**
     * @todo
     */
    static async getAll(db: Database) {
        return await db.table(this.table).toArray()
    }

    /**
     * @todo
     */
    static async get(db: Database, id: IdType): Promise<ModelType> {
        const modelToGet = await db.table(this.table).get(id)
        if (!modelToGet) {
            throw new Error(`Record not found: ${id}`)
        }
        return modelToGet!
    }

    /**
     * @todo
     */
    static async add(db: Database, model: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(model)
        await db.table(this.table).add(validatedModel)
        return validatedModel
    }

    /**
     * @todo
     */
    static async put(db: Database, model: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(model)
        await db.table(this.table).put(validatedModel)
        return validatedModel
    }

    /**
     * @todo
     */
    static async delete(db: Database, id: IdType): Promise<ModelType> {
        const modelToDelete = await db.table(this.table).get(id)
        if (!modelToDelete) {
            throw new Error(`Record not found: ${id}`)
        }
        await db.table(this.table).delete(id)
        return modelToDelete
    }

    /**
     * @todo
     */
    static validate(models: ModelType[]) {
        const validModels: ModelType[] = []
        const skippedModels: ModelType[] = []

        models.forEach((m) => {
            if (this.modelSchema.safeParse(m).success) {
                validModels.push(this.modelSchema.parse(m)) // Clean record with parse
            } else {
                skippedModels.push(m)
            }
        })

        return { validModels, skippedModels }
    }

    /**
     * @todo
     */
    static async import(db: Database, models: ModelType[]) {
        const { validModels, skippedModels } = this.validate(models)
        await db.table(this.table).bulkAdd(validModels)
        return skippedModels
    }

    /**
     * @todo
     */
    static async export(db: Database) {
        return await this.getAll(db)
    }

    /**
     * @todo
     */
    static async clear(db: Database) {
        return await db.table(this.table).clear()
    }

    // eslint-disable-next-line
    static liveDashboard(db: Database): Observable<any[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static clean(models: ModelType[]): ModelType[] {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async updateLastChild(db: Database, parentId: IdType): Promise<void> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async toggleFavorite(db: Database, model: ModelType): Promise<void> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async getSelectOptions(db: Database): Promise<SelectOption[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async purgeLogs(db: Database): Promise<number> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async initSettings(db: Database): Promise<Setting[]> {
        throw new Error('Not available on this Service')
    }
}
