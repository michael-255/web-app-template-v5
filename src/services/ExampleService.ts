import { exampleSchema, type ExampleType } from '@/models/Example'
import DB, { Database } from '@/services/db'
import { StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExampleService(db: Database = DB) {
    /**
     * Returns Examples live query with records that are not deactivated with the remaining sorted
     * with locked records first, then favorited records, then alphabetically by name, and finally
     * by createdAt reversed.
     */
    function liveDashboardObservable(): Observable<ExampleType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.EXAMPLES)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.DEACTIVATED))
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
    }

    /**
     * Returns Examples live query ordered by name with locked records filtered out.
     */
    function liveObservable(): Observable<ExampleType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.EXAMPLES)
                .orderBy('name')
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .toArray(),
        )
    }

    /**
     * Returns Example by ID.
     */
    async function get(id: IdType): Promise<ExampleType> {
        const recordToGet = await db.table(TableEnum.EXAMPLES).get(id)
        if (!recordToGet) {
            throw new Error(`Example ID not found: ${id}`)
        }
        return recordToGet!
    }

    /**
     * Creates a new Example in the database.
     */
    async function add(example: ExampleType): Promise<ExampleType> {
        const validatedRecord = exampleSchema.parse(example)
        await db.table(TableEnum.EXAMPLES).add(validatedRecord)
        return validatedRecord
    }

    /**
     * Creates or overwrites am Example in the database.
     */
    async function put(example: ExampleType): Promise<ExampleType> {
        const validatedRecord = exampleSchema.parse(example)
        await db.table(TableEnum.EXAMPLES).put(validatedRecord)
        return validatedRecord
    }

    /**
     * Removes the Example by id and all associated child records from the database.
     */
    async function remove(id: IdType): Promise<ExampleType> {
        const recordToDelete = await db.table(TableEnum.EXAMPLES).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLES),
            db.table(TableEnum.EXAMPLE_RESULTS),
            async () => {
                await db.table(TableEnum.EXAMPLES).delete(id)
                await db.table(TableEnum.EXAMPLE_RESULTS).where('parentId').equals(id).delete()
            },
        )
        return recordToDelete
    }

    /**
     * Imports Examples into the database using put and returns a results object.
     */
    async function importData(examples: ExampleType[]) {
        const validRecords: ExampleType[] = []
        const invalidRecords: Partial<ExampleType>[] = []

        // Validate each record
        examples.forEach((example) => {
            if (exampleSchema.safeParse(example).success) {
                validRecords.push(exampleSchema.parse(example)) // Clean record with parse
            } else {
                invalidRecords.push(example)
            }
        })

        // Put validated records into the database. Catch any bulk errors.
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.EXAMPLES).bulkAdd(validRecords)
        } catch (error) {
            bulkError = {
                name: (error as Error)?.name,
                message: (error as Error)?.message,
            }
        }

        // Return results object for FE handling
        return {
            validRecords,
            invalidRecords,
            importedCount: validRecords.length,
            bulkError,
        }
    }

    /**
     * Custom export operation for fetching all Examples from the database with unneeded fields
     * removed.
     */
    async function exportData() {
        const records = await db.table(TableEnum.EXAMPLES).toArray()
        return records.map((record) => {
            if ('lastChild' in record) {
                delete record.lastChild
            }
            return record
        })
    }

    /**
     * From Parent:
     *
     * Updates the `lastChild` property of the Example associated with the `parentId` with the
     * most recently created child record.
     */
    async function updateLastChild(parentId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.EXAMPLE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Toggles the favorited status on the Example's status property.
     */
    async function toggleFavorite(example: ExampleType) {
        const index = example.status.indexOf(StatusEnum.FAVORITED)
        if (index === -1) {
            example.status.push(StatusEnum.FAVORITED)
        } else {
            example.status.splice(index, 1)
        }
        await db.table(TableEnum.EXAMPLES).update(example.id, { status: example.status })
    }

    /**
     * Generates an options list of Examples for select box components on the FE. Filters out
     * locked and deactivated records and truncates the ID to save space.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db
            .table(TableEnum.EXAMPLES)
            .orderBy('name')
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .filter((record) => !record.status.includes(StatusEnum.DEACTIVATED))
            .toArray()

        return records.map((record) => {
            const recordName = record.name
            const recordId = truncateText(record.id, 8, '*')
            const recordFavorite = record.status.includes(StatusEnum.FAVORITED) ? '⭐' : ''

            return {
                value: record.id as IdType,
                label: `${recordName} (${recordId}) ${recordFavorite}`,
                disable: false, // Already filtered out disabled records
            }
        })
    }

    return {
        liveDashboardObservable,
        liveObservable,
        get,
        add,
        put,
        remove,
        importData,
        exportData,
        updateLastChild,
        toggleFavorite,
        getSelectOptions,
    }
}
