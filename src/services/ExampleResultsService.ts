import DB, { Database } from '@/services/db'
import { TableEnum, TagEnum } from '@/shared/enums'
import { exampleResultSchema } from '@/shared/schemas'
import type { ExampleResultType, IdType } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExampleResultsService(db: Database = DB) {
    /**
     * Returns Examples live query ordered by creation date.
     */
    function liveObservable(): Observable<ExampleResultType[]> {
        return liveQuery(() =>
            db.table(TableEnum.EXAMPLE_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns Example Result by ID.
     */
    async function get(id: IdType): Promise<ExampleResultType> {
        const recordToGet = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Example Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Imports Example Results into the database using put and returns a results object.
     */
    async function importData(examplesResults: ExampleResultType[]) {
        const validRecords: ExampleResultType[] = []
        const invalidRecords: Partial<ExampleResultType>[] = []

        // Validate each Example Result
        examplesResults.forEach((record) => {
            if (exampleResultSchema.safeParse(record).success) {
                validRecords.push(exampleResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated Example Result into the database
        let bulkError: Record<string, string> = null!
        try {
            await db.table(TableEnum.EXAMPLE_RESULTS).bulkAdd(validRecords)
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
     * Returns all Example Results sorted by creation date in descending order.
     */
    async function getAll() {
        return await db.table(TableEnum.EXAMPLE_RESULTS).orderBy('createdAt').reverse().toArray()
    }

    /**
     * Creates a new Example Result and updates the parent Example `lastChild` property.
     */
    async function add(exampleResult: ExampleResultType): Promise<ExampleResultType> {
        const validatedRecord = exampleResultSchema.parse(exampleResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLE_RESULTS).add(validatedRecord)
                await updateLastChild(validatedRecord.parentId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async function put(exampleResult: ExampleResultType): Promise<ExampleResultType> {
        const validatedRecord = exampleResultSchema.parse(exampleResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLE_RESULTS).put(validatedRecord)
                await updateLastChild(validatedRecord.parentId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async function remove(id: IdType): Promise<ExampleResultType> {
        const recordToDelete = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLE_RESULTS).delete(id)
                await updateLastChild(recordToDelete.parentId)
            },
        )
        return recordToDelete
    }

    /**
     * From Child:
     *
     * Updates the `lastChild` property of the parent model associated with the `parentId` with the
     * most recently created child model.
     */
    async function updateLastChild(parentId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.EXAMPLE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    async function getSelectOptions() {
        const exampleResults = await db
            .table(TableEnum.EXAMPLE_RESULTS)
            .orderBy('createdAt')
            .reverse()
            .toArray()
        return exampleResults.map((record) => ({
            value: record.id as IdType,
            label: `${truncateText(record.id, 8, '*')} (${truncateText(record.parentId, 8, '*')})`,
            disable: record.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }

    return {
        get,
        liveObservable,
        importData,
        getAll,
        add,
        put,
        remove,
        updateLastChild,
        getSelectOptions,
    }
}
