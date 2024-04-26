import type Setting from '@/models/Setting'
import type { Database } from '@/services/db'
import { GroupEnum, SlugTableEnum, type TableEnum } from '@/shared/enums'
import type { IdType, ModelType, SelectOption } from '@/shared/types'
import { type Observable } from 'dexie'
import type { z } from 'zod'

/**
 * Stubbed Model Service (WIP)
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

    // eslint-disable-next-line
    static liveTable(db: Database): Observable<ModelType[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static liveDashboard(db: Database): Observable<ModelType[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async getAll(db: Database): Promise<ModelType[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async get(db: Database, id: IdType): Promise<ModelType> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async add(db: Database, model: ModelType): Promise<ModelType> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async put(db: Database, model: ModelType): Promise<ModelType> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async delete(db: Database, id: IdType): Promise<ModelType> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static validate(models: ModelType[]): { validModels: ModelType[]; skippedModels: ModelType[] } {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async import(db: Database, models: ModelType[]): Promise<ModelType[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async export(db: Database): Promise<ModelType[]> {
        throw new Error('Not available on this Service')
    }

    // eslint-disable-next-line
    static async clear(db: Database): Promise<void> {
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
