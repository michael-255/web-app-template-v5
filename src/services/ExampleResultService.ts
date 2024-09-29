import { exampleResultSchema, type ExampleResultType } from '@/models/ExampleResult'
import DB, { Database } from '@/services/db'
import { DurationMSEnum, StatusEnum, TableEnum } from '@/shared/enums'
import type { IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'

export default function ExampleResultService(db: Database = DB) {
    /**
     * Returns Example Results live query ordered by creation date with locked records filtered out.
     */
    function liveObservable(): Observable<ExampleResultType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.EXAMPLE_RESULTS)
                .orderBy('createdAt')
                .reverse()
                .filter((record) => !record.status.includes(StatusEnum.LOCKED))
                .toArray(),
        )
    }

    /**
     * Returns chart datasets for the Example Results associated with a parent Example.
     */
    async function getChartDatasets(parentId: IdType) {
        const allExampleResults = await db
            .table(TableEnum.EXAMPLE_RESULTS)
            .where('parentId')
            .equals(parentId)
            .sortBy('createdAt')

        const now = Date.now()
        const threeMonthsAgo = now - DurationMSEnum['Three Months']
        const oneYearAgo = now - DurationMSEnum['One Year']

        const exampleResultsThreeMonths = allExampleResults.filter(
            (record) => record.createdAt > threeMonthsAgo,
        )
        const exampleResultsOneYear = allExampleResults.filter(
            (record) => record.createdAt > oneYearAgo,
        )

        const allCount = allExampleResults.length
        const threeMonthCount = exampleResultsThreeMonths.length
        const oneYearCount = exampleResultsOneYear.length

        // Determine if there are records beyond the three month and one year thresholds
        const hasRecords = allCount > 0
        const hasRecordsBeyondThreeMonths = allCount - threeMonthCount > 0
        const hasRecordsBeyondOneYear = allCount - oneYearCount > 0

        return {
            threeMonths: exampleResultsThreeMonths.map((record) => ({
                x: record.createdAt,
                y: record.mockData,
            })),
            oneYear: exampleResultsOneYear.map((record) => ({
                x: record.createdAt,
                y: record.mockData,
            })),
            allTime: allExampleResults.map((record) => ({
                x: record.createdAt,
                y: record.mockData,
            })),
            hasRecords,
            hasRecordsBeyondThreeMonths,
            hasRecordsBeyondOneYear,
        }
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
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Generates an options list of Example Results for select box components on the FE. Filters out
     * locked records and truncates the ID to save space.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const records = await db
            .table(TableEnum.EXAMPLE_RESULTS)
            .orderBy('createdAt')
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()
            .toArray()

        return records.map((record) => {
            const recordId = truncateText(record.id, 8, '*')
            const recordParentId = truncateText(record.parentId, 8, '*')

            return {
                value: record.id as IdType,
                label: `${recordId} (${recordParentId})`,
                disable: false, // Already filtered out disabled records
            }
        })
    }

    return {
        liveObservable,
        getChartDatasets,
        get,
        add,
        put,
        remove,
        importData,
        updateLastChild,
        getSelectOptions,
    }
}
