import type Setting from '@/models/Setting'
import { GroupEnum, RouteTableEnum, type TableEnum } from '@/shared/enums'
import type { IdType, ModelComponent, ModelType, SelectOption } from '@/shared/types'
import { compactDateFromMs, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QTableColumn } from 'quasar'
import type { z } from 'zod'
import type { Database } from '../db'

/**
 * The `BaseModelService` is for `Services` to extend if they handle database operations with
 * standalone models with no explicit releationship to any other model. This `Service` defines all
 * the default properties and methods extending `Services` may use or override.
 */
export default abstract class BaseModelService {
    abstract Model: ModelType
    abstract labelSingular: string
    abstract labelPlural: string
    abstract modelSchema: z.ZodSchema<any>
    abstract table: TableEnum
    abstract routeTable: RouteTableEnum
    abstract parentTable: TableEnum
    abstract childTable: TableEnum
    group: GroupEnum = GroupEnum.STANDALONE
    abstract tableColumns: QTableColumn[]

    abstract liveDashboard(db: Database): Observable<ModelType[]>
    abstract clean(records: ModelType[]): ModelType[]
    abstract updateLastChild(db: Database, parentId: IdType): Promise<void>
    abstract toggleFavorite(db: Database, record: ModelType): Promise<void>
    abstract getSelectOptions(db: Database): Promise<SelectOption[]>
    abstract purgeLogs(db: Database): Promise<number>
    abstract initSettings(db: Database): Promise<Setting[]>
    abstract inspectComponents(): ModelComponent[]
    abstract formComponents(mutation: 'Create' | 'Edit'): ModelComponent[]
    abstract dataTable(liveRows: ModelType[]): ModelComponent

    /**
     * Create a hidden `QTableColumn`. Use this to hide a column that may be needed for `QTable` row
     * props, but should not be visible in the UI (normally `id`).
     * @param rowPropertyName Name of the property on the record for this column
     * @returns `QTableColumn`
     */
    hiddenTableColumn(rowPropertyName: string): QTableColumn {
        return {
            name: 'hidden', // Needed in QTable row props
            label: '',
            align: 'left',
            sortable: false,
            required: true,
            field: (row: Record<string, string>) => row[rowPropertyName],
            format: (val: string) => `${val}`,
            style: 'display: none', // Hide column in QTable
        }
    }

    /**
     * Create a standard `QTableColumn`.
     * @param rowPropertyName Name of the property on the record for this column
     * @param label Display label for the property on this column
     * @param format How the property data should be formatted for display
     * @returns `QTableColumn`
     */
    tableColumn(
        rowPropertyName: string,
        label: string,
        format?: 'UUID' | 'TEXT' | 'BOOL' | 'JSON' | 'DATE' | 'LIST-COUNT' | 'LIST-PRINT',
    ): QTableColumn {
        // Initial column properties
        const tableColumn: QTableColumn = {
            name: rowPropertyName,
            label: label,
            align: 'left',
            sortable: true,
            required: false,
            field: (row: Record<string, string>) => row[rowPropertyName],
            format: (val: string) => `${val}`, // Default converts everything to a string
        }

        switch (format) {
            case 'UUID':
                // Truncates so it won't overflow the table cell
                tableColumn.format = (val: string) => truncateText(val, 8, '*')
                return tableColumn
            case 'TEXT':
                // Truncates so it won't overflow the table cell
                tableColumn.format = (val: string) => truncateText(val, 40, '...')
                return tableColumn
            case 'BOOL':
                // Converts output to a Yes or No string
                tableColumn.format = (val: boolean) => (val ? 'Yes' : 'No')
                return tableColumn
            case 'JSON':
                // Converts to JSON and truncates so it won't overflow the table cell
                tableColumn.format = (val: Record<string, string>) =>
                    truncateText(JSON.stringify(val), 40, '...')
                return tableColumn
            case 'DATE':
                // Converts to a compact date string
                tableColumn.format = (val: number) => compactDateFromMs(val)
                return tableColumn
            case 'LIST-COUNT':
                // Converts list to a count of the items
                tableColumn.format = (val: any[]) => `${val?.length ? val.length : 0}`
                return tableColumn
            case 'LIST-PRINT':
                // Prints the list as a truncated string
                tableColumn.format = (val: any[]) => truncateText(val.join(', '), 40, '...')
                return tableColumn
            default:
                // Default just converts the result to a string as is
                return tableColumn
        }
    }

    /**
     * Returns live query with records from the getAll method.
     */
    liveTable(db: Database) {
        return liveQuery(() => this.getAll(db))
    }

    /**
     * Returns all records in a table.
     */
    async getAll(db: Database) {
        return await db.table(this.table).toArray()
    }

    /**
     * Returns a record by id.
     */
    async get(db: Database, id: IdType): Promise<ModelType> {
        const modelToGet = await db.table(this.table).get(id)
        if (!modelToGet) {
            throw new Error(`Record not found: ${id}`)
        }
        return modelToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add(db: Database, record: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(record)
        await db.table(this.table).add(validatedModel)
        return validatedModel
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put(db: Database, record: ModelType): Promise<ModelType> {
        const validatedModel = this.modelSchema.parse(record)
        await db.table(this.table).put(validatedModel)
        return validatedModel
    }

    /**
     * Removes a record from the database.
     */
    async delete(db: Database, id: IdType): Promise<ModelType> {
        const modelToDelete = await db.table(this.table).get(id)
        if (!modelToDelete) {
            throw new Error(`Record not found: ${id}`)
        }
        await db.table(this.table).delete(id)
        return modelToDelete
    }

    /**
     * Validates records against the model schema and returns valid and skipped records.
     */
    validate(records: ModelType[]): {
        validRecords: ModelType[]
        skippedRecords: Partial<ModelType>[]
    } {
        const validRecords: ModelType[] = []
        const skippedRecords: Partial<ModelType>[] = []

        records.forEach((r) => {
            if (this.modelSchema.safeParse(r).success) {
                validRecords.push(this.modelSchema.parse(r)) // Clean record with parse
            } else {
                skippedRecords.push(r)
            }
        })

        return { validRecords, skippedRecords }
    }

    /**
     * Imports records into the database and returns skipped records.
     */
    async import(db: Database, records: ModelType[]) {
        const { validRecords, skippedRecords } = this.validate(records)
        await db.table(this.table).bulkAdd(validRecords)
        return skippedRecords
    }

    /**
     * Exports records from the table using getAll method to retrieve them.
     */
    async export(db: Database) {
        return await this.getAll(db)
    }

    /**
     * Updates all parent record `lastChild` properties with the most recently created child record.
     */
    async updateAssociations(db: Database): Promise<void> {
        if (this.group === GroupEnum.PARENT) {
            const parentRecords = await this.getAll(db)
            await Promise.all(parentRecords.map((r) => this.updateLastChild(db, r.id)))
        }
    }

    /**
     * Clears all records from the table.
     */
    async clear(db: Database) {
        return await db.table(this.table).clear()
    }
}
