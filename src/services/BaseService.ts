import type { LogType } from '@/models/Log'
import { Settings } from '@/models/Settings'
import { appSettingsId } from '@/shared/constants'
import { DurationEnum, DurationMSEnum, StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption, ServiceType } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions, QTableColumn } from 'quasar'
import type { z } from 'zod'
import { DB, Database } from './db'

/**
 * Abstract base class for all Services to extend. This defines properties and database methods that
 * other Services may use. Only need to override the methods that are needed for the specific
 * extending Service (like dialog options).
 */
export abstract class BaseService {
    /**
     * Map of instances of each Service class. This is used to ensure that only one instance of each
     * Service class is created and used throughout the application.
     */
    private static _instances: Map<new () => BaseService, BaseService> = new Map()

    /**
     * Database instance used by all Services. This is set when the first Service is created by
     * the protected constructor.
     */
    private static _database: Database = null!

    protected constructor(database: Database = DB) {
        if (!BaseService._database) {
            BaseService._database = database
        }
    }

    /**
     * Singleton pattern that returns an instance of a class that extends the BaseService class.
     */
    static instance<S extends BaseService>(this: new () => S): S {
        if (!BaseService._instances.has(this)) {
            BaseService._instances.set(this, new this())
        }
        return BaseService._instances.get(this) as S
    }

    /**
     * Convenience method for accessing the Database instance.
     */
    protected get db(): Database {
        return BaseService._database
    }

    abstract labelSingular: string
    abstract labelPlural: string
    abstract displayIcon: string
    abstract tableIcon: string
    abstract modelSchema: z.ZodSchema<any>
    abstract parentTable: TableEnum
    abstract table: TableEnum
    abstract childTable: TableEnum
    abstract tableColumns: QTableColumn[]
    abstract supportsColumnFilters: boolean
    abstract supportsActivityCharts: boolean
    abstract supportsCharts: boolean
    abstract supportsInspect: boolean
    abstract supportsCreate: boolean
    abstract supportsEdit: boolean
    abstract supportsDelete: boolean

    isParentTable(): boolean {
        return !this.parentTable && this.childTable
    }

    isChildTable(): boolean {
        return !this.childTable && this.parentTable
    }

    isStandaloneTable(): boolean {
        return !this.parentTable && !this.childTable
    }

    parentService(): ServiceType {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    childService(): ServiceType {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    activityChartsDialogOptions(): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    chartsDialogOptions(id: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    inspectDialogOptions(id: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    createDialogOptions(parentId?: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    editDialogOptions(id: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    deleteDialogOptions(id: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    toggleFavoriteDialogOptions(id: IdType): QDialogOptions {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    // eslint-disable-next-line
    async getChartDatasets(parentId: IdType): Promise<{
        threeMonths: {
            x: any
            y: any
        }[]
        oneYear: {
            x: any
            y: any
        }[]
        allTime: {
            x: any
            y: any
        }[]
        hasRecords: boolean
        hasRecordsBeyondThreeMonths: boolean
        hasRecordsBeyondOneYear: boolean
    }> {
        throw new Error(`Not supported by the ${this.labelSingular} Service`)
    }

    /**
     * Returns live query of a parent table with records that are not hidden with the remaining
     * sorted with locked records first, then favorited records, then alphabetically by name, and
     * finally by createdAt reversed.
     */
    liveDashboard<T>(): Observable<T[]> {
        if (this.isParentTable()) {
            return liveQuery(() =>
                this.db
                    .table(this.table)
                    .orderBy('name')
                    .filter((record) => !record.status.includes(StatusEnum.HIDDEN))
                    .toArray()
                    .then((records) =>
                        records.sort((a, b) => {
                            // Locked records come first to indicate they are active in some way
                            const aIsLocked = a.status.includes(StatusEnum.LOCKED)
                            const bIsLocked = b.status.includes(StatusEnum.LOCKED)

                            if (aIsLocked && !bIsLocked) {
                                return -1 // a comes first
                            }
                            if (!aIsLocked && bIsLocked) {
                                return 1 // b comes first
                            }

                            const aIsFavorited = a.status.includes(StatusEnum.FAVORITED)
                            const bIsFavorited = b.status.includes(StatusEnum.FAVORITED)

                            if (aIsFavorited && !bIsFavorited) {
                                return -1 // a comes first
                            }

                            if (!aIsFavorited && bIsFavorited) {
                                return 1 // b comes first
                            }

                            // If both or neither are favorited, sort alphabetically by name
                            const nameComparison = a.name.localeCompare(b.name)
                            if (nameComparison !== 0) {
                                return nameComparison
                            }

                            // If names are identical, sort by createdAt reversed (b - a)
                            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        }),
                    ),
            )
        } else {
            throw new Error(`Not supported by the ${this.labelSingular} Service`)
        }
    }

    /**
     * Returns a live query of ordered records.
     */
    liveTable<T>(): Observable<T[]> {
        if (this.isParentTable()) {
            return liveQuery(() => this.db.table(this.table).orderBy('name').toArray())
        } else if (this.isChildTable() || this.table === TableEnum.LOGS) {
            return liveQuery(() =>
                this.db.table(this.table).orderBy('createdAt').reverse().toArray(),
            )
        } else {
            return liveQuery(() => this.db.table(this.table).toArray())
        }
    }

    /**
     * Purges logs based on the log retention duration setting. Returns the number of logs purged.
     */
    async purge() {
        if (this.table === TableEnum.LOGS) {
            const appSettings = await this.db.table(TableEnum.SETTINGS).get(appSettingsId)
            const logRetentionDuration = appSettings?.logRetentionDuration as DurationEnum

            if (!logRetentionDuration || logRetentionDuration === DurationEnum.Forever) {
                return 0 // No logs purged
            }

            const allLogs = await this.db.table(TableEnum.LOGS).toArray()
            const maxLogAgeMs = DurationMSEnum[logRetentionDuration]
            const now = Date.now()

            // Find Logs that are older than the retention time and map them to their keys
            const removableLogs = allLogs
                .filter((log: LogType) => {
                    const logTimestamp = log.createdAt ?? 0
                    const logAge = now - logTimestamp
                    return logAge > maxLogAgeMs
                })
                .map((log: LogType) => log.id) // Map remaining Log ids for removal

            await this.db.table(TableEnum.LOGS).bulkDelete(removableLogs)
            return removableLogs.length // Number of logs deleted
        } else {
            throw new Error(`Not supported by the ${this.labelSingular} Service`)
        }
    }

    /**
     * Initializes the table with default data if supported.
     */
    async initialize(): Promise<void> {
        if (this.table === TableEnum.SETTINGS) {
            const appSettings = await this.db.table(TableEnum.SETTINGS).get(appSettingsId)

            if (!appSettings) {
                await this.db.table(TableEnum.SETTINGS).put(new Settings({}))
            }
        } else {
            Promise.resolve() // No initialization
        }
    }

    /**
     * Returns a record by ID.
     */
    async get<T>(id: IdType): Promise<T> {
        const recordToGet = await this.db.table(this.table).get(id)
        if (!recordToGet) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new record in the database.
     */
    async add<T>(record: T): Promise<T> {
        const validatedRecord = this.modelSchema.parse(record)

        if (this.isParentTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.childTable),
                async () => {
                    await this.db.table(this.table).add(validatedRecord)
                    await this.updateLastChild(validatedRecord.id)
                },
            )
        } else if (this.isChildTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.parentTable),
                async () => {
                    await this.db.table(this.table).add(validatedRecord)
                    await this.updateLastChild(validatedRecord.parentId)
                },
            )
        } else {
            await this.db.table(this.table).add(validatedRecord)
        }

        return validatedRecord
    }

    /**
     * Creates or overwrites a record in the database.
     */
    async put<T>(record: T): Promise<T> {
        const validatedRecord = this.modelSchema.parse(record)

        if (this.isParentTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.childTable),
                async () => {
                    await this.db.table(this.table).put(validatedRecord)
                    await this.updateLastChild(validatedRecord.id)
                },
            )
        } else if (this.isChildTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.parentTable),
                async () => {
                    await this.db.table(this.table).put(validatedRecord)
                    await this.updateLastChild(validatedRecord.parentId)
                },
            )
        } else {
            await this.db.table(this.table).put(validatedRecord)
        }

        return validatedRecord
    }

    /**
     * Updates a record by ID with the provided properties.
     */
    async update<T>(id: IdType, props: Partial<T>): Promise<T> {
        const recordToUpdate = await this.db.table(this.table).get(id)
        if (!recordToUpdate) {
            throw new Error(`${this.labelSingular} ID not found: ${id}`)
        }
        const updatedRecord = { ...recordToUpdate, ...props }

        if (this.isParentTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.childTable),
                async () => {
                    await this.db.table(this.table).update(id, updatedRecord)
                    await this.updateLastChild(id)
                },
            )
        } else if (this.isChildTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.parentTable),
                async () => {
                    await this.db.table(this.table).update(id, updatedRecord)
                    await this.updateLastChild(updatedRecord.parentId)
                },
            )
        } else {
            await this.db.table(this.table).update(id, updatedRecord)
        }

        return updatedRecord
    }

    /**
     * Removes the record by ID. Associated records will be updated or removed as needed.
     */
    async remove<T>(id: IdType): Promise<T> {
        const recordToDelete = await this.db.table(this.table).get(id)

        if (this.isParentTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.childTable),
                async () => {
                    await this.db.table(this.table).delete(id)
                    await this.db.table(this.childTable).where('parentId').equals(id).delete()
                },
            )
        } else if (this.isChildTable()) {
            await this.db.transaction(
                'rw',
                this.db.table(this.table),
                this.db.table(this.parentTable),
                async () => {
                    await this.db.table(this.table).delete(id)
                    await this.updateLastChild(recordToDelete.parentId)
                },
            )
        } else {
            await this.db.table(this.table).delete(id)
        }

        return recordToDelete
    }

    /**
     * Removes all records from the table and reinitializes it.
     */
    async clear() {
        await this.db.table(this.table).clear()

        if (this.isParentTable()) {
            // Clear child table when parent table is cleared
            await this.db.table(this.childTable).clear()
        } else if (this.isChildTable()) {
            // Remove lastChild property from parent records when child table is cleared
            await this.db
                .table(this.parentTable)
                .toArray()
                .then((records) => {
                    records.map((record) => delete record.lastChild)
                })
        }

        await this.initialize()
    }

    /**
     * Imports records into the database and returns a results object.
     */
    async importData<T>(records: T[]): Promise<{
        validRecords: T[]
        invalidRecords: Partial<T>[]
        importedCount: number
        bulkError?: { name: string; message: string }
    }> {
        const validRecords: T[] = []
        const invalidRecords: Partial<T>[] = []

        // Validate each setting
        for (let i = 0; i < records.length; i++) {
            const record = records[i]
            if (this.modelSchema.safeParse(record).success) {
                validRecords.push(this.modelSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        }

        let bulkError: { name: string; message: string } = null!

        // Handle Settings as a special case where they get put over existing settings
        if (this.table === TableEnum.SETTINGS) {
            const appSettings = records.find((record: any) => record.id === appSettingsId)
            if (appSettings) {
                await this.db.table(TableEnum.SETTINGS).put(appSettings)
            }
        } else {
            // Add validated records into the database. Catch any bulk errors.
            try {
                await this.db.table(this.table).bulkAdd(validRecords)
            } catch (error) {
                bulkError = {
                    name: (error as Error)?.name,
                    message: (error as Error)?.message,
                }
            }
        }

        if (this.isParentTable()) {
            // Ensure lastChild property is updated for each parent record
            const parentIds = validRecords.map((record: any) => record.id)
            await Promise.all(parentIds.map((parentId) => this.updateLastChild(parentId)))
        } else if (this.isChildTable()) {
            // Ensure lastChild property is updated for each parent record
            const parentIds = Array.from(
                new Set(validRecords.map((record: any) => record.parentId)),
            )
            await Promise.all(parentIds.map((parentId) => this.updateLastChild(parentId)))
        }

        return {
            validRecords,
            invalidRecords,
            importedCount: validRecords.length,
            bulkError,
        }
    }

    /**
     * Exports all records from the table.
     */
    async exportData<T>(): Promise<T[]> {
        const records = await this.db.table(this.table).toArray()

        if (this.isParentTable()) {
            // The lastChild property is not exported to save space and prevent issues on re-import
            records.map((record: Record<string, any>) => delete record.lastChild)
        }

        return records
    }

    /**
     * Updates the `lastChild` property of the record associated with the `parentId` with the
     * most recently created child record. Locked records are not updated.
     */
    async updateLastChild(parentId: IdType) {
        if (this.isParentTable()) {
            const lastChild = (
                await this.db
                    .table(this.childTable)
                    .where('parentId')
                    .equals(parentId)
                    .sortBy('createdAt')
            )
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .reverse()[0]

            return await this.db.table(this.table).update(parentId, { lastChild })
        } else if (this.isChildTable()) {
            const lastChild = (
                await this.db
                    .table(this.table)
                    .where('parentId')
                    .equals(parentId)
                    .sortBy('createdAt')
            )
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .reverse()[0]

            return await this.db.table(this.parentTable).update(parentId, { lastChild })
        } else {
            throw new Error(`Not supported by the ${this.labelSingular} Service`)
        }
    }

    /**
     * Toggles the favorited status on the record's status property.
     */
    async toggleFavorite<T extends { id: IdType; status: StatusEnum[] }>(record: T): Promise<void> {
        const index = record.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            record.status.push(StatusEnum.FAVORITED)
        } else {
            record.status.splice(index, 1)
        }
        await this.db.table(this.table).update(record.id, { status: record.status })
    }

    async getSelectOptions(): Promise<SelectOption[]> {
        if (this.isParentTable()) {
            // Select options for parent tables
            const records = await this.db
                .table(this.table)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.HIDDEN))
                .toArray()

            return records.map((record: any) => {
                const name = record.name
                const id = truncateText(record.id, 8, '*')
                const favorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''
                const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
                const disable =
                    record.status.includes(StatusEnum.LOCKED) ||
                    record.status.includes(StatusEnum.HIDDEN)

                return {
                    value: record.id as IdType,
                    label: `${name} (${id}) ${locked}${favorite}`,
                    disable,
                }
            })
        } else if (this.isChildTable()) {
            // Select options for child tables
            const records = await this.db.table(this.table).orderBy('createdAt').reverse().toArray()

            return records.map((record) => {
                const id = truncateText(record.id, 8, '*')
                const parentId = truncateText(record.parentId, 8, '*')
                const favorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''
                const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
                const disable =
                    record.status.includes(StatusEnum.LOCKED) ||
                    record.status.includes(StatusEnum.HIDDEN)

                return {
                    value: record.id as IdType,
                    label: `${id} (${parentId}) ${locked}${favorite}`,
                    disable,
                }
            })
        } else {
            throw new Error(`Not supported by the ${this.labelSingular} Service`)
        }
    }
}
