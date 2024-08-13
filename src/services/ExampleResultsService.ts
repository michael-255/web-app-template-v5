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
        const exampleResult = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        if (!exampleResult) {
            throw new Error(`Example Result ID not found: ${id}`)
        }
        return exampleResult
    }

    /**
     * Imports Example Results into the database using put and returns invalid Example Results.
     */
    async function importData(
        examplesResults: ExampleResultType[],
    ): Promise<Partial<ExampleResultType>[]> {
        const validExamplesResults: ExampleResultType[] = []
        const invalidExamplesResults: Partial<ExampleResultType>[] = []

        // Validate each Example Result
        examplesResults.forEach((e) => {
            if (exampleResultSchema.safeParse(e).success) {
                validExamplesResults.push(exampleResultSchema.parse(e)) // Clean record with parse
            } else {
                invalidExamplesResults.push(e)
            }
        })

        // Put validated Example Result into the database
        await Promise.all(
            validExamplesResults.map((e) => db.table(TableEnum.EXAMPLE_RESULTS).put(e)),
        )

        // Return invalid Example Result for FE error handling
        return invalidExamplesResults
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
        const validatedExampleResult = exampleResultSchema.parse(exampleResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLES).add(validatedExampleResult)
                await updateLastChild(validatedExampleResult.parentId)
            },
        )
        return validatedExampleResult
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async function remove(id: IdType): Promise<ExampleResultType> {
        const exampleResultsToDelete = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLE_RESULTS).delete(id)
                await updateLastChild(exampleResultsToDelete.parentId)
            },
        )
        return exampleResultsToDelete
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
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
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
        return exampleResults.map((e: ExampleResultType) => ({
            value: e.id as IdType,
            label: `${truncateText(e.id, 8, '*')} (${truncateText(e.parentId, 8, '*')})`,
            disable: e.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }

    return {
        get,
        liveObservable,
        importData,
        getAll,
        add,
        remove,
        updateLastChild,
        getSelectOptions,
    }
}
