import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogDelete from '@/components/dialogs/DialogDelete.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import FormItemCreatedDate from '@/components/dialogs/forms/FormItemCreatedDate.vue'
import FormItemId from '@/components/dialogs/forms/FormItemId.vue'
import FormItemMockData from '@/components/dialogs/forms/FormItemMockData.vue'
import FormItemNote from '@/components/dialogs/forms/FormItemNote.vue'
import FormItemParentId from '@/components/dialogs/forms/FormItemParentId.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemList from '@/components/dialogs/inspect/InspectItemList.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import ExampleResult, { exampleResultSchema, type ExampleResultType } from '@/models/ExampleResult'
import { DurationMSEnum, StatusEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import type { IdType, SelectOption, ServiceType } from '@/shared/types'
import { hiddenTableColumn, tableColumn, truncateText } from '@/shared/utils'
import { liveQuery, type Observable } from 'dexie'
import type { QDialogOptions } from 'quasar'
import BaseService from './BaseService'
import { ExampleService } from './ExampleService'

/**
 * Singleton class for managing most aspects of the ExampleResult model.
 */
export class ExampleResultService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Example Result'
    labelPlural = 'Example Results'
    modelSchema = exampleResultSchema
    table = TableEnum.EXAMPLE_RESULTS
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
        tableColumn('note', 'Note', 'TEXT'),
        tableColumn('mockData', 'Mock Data'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
    ]
    displayIcon = databaseIcon
    tableIcon = databaseIcon
    supportsTableColumnFilters = true
    supportsTableCharts = false
    supportsCharts = false
    supportsInspect = true
    supportsCreate = true
    supportsEdit = true
    supportsDelete = true

    /**
     * Returns the parent service for this child service.
     */
    parentService(): ServiceType {
        return ExampleService.instance()
    }

    /**
     * Returns QDialogOptions options for the inspect dialog.
     * @example $q.dialog(service.inspectDialogOptions(id))
     */
    inspectDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogInspect,
            componentProps: {
                id,
                service: this,
                inspectComponents: [
                    { component: InspectItemString, props: { label: 'Id', recordKey: 'id' } },
                    {
                        component: InspectItemDate,
                        props: { label: 'Created Date', recordKey: 'createdAt' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Parent Example Id', recordKey: 'parentId' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Note', recordKey: 'note' },
                    },
                    {
                        component: InspectItemList,
                        props: { label: 'Status', recordKey: 'status' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Mock Data', recordKey: 'mockData' },
                    },
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the create dialog.
     * @example $q.dialog(service.createDialogOptions())
     */
    createDialogOptions(parentId?: IdType): QDialogOptions {
        let exampleResult: ExampleResult = null!

        if (parentId) {
            exampleResult = new ExampleResult({ parentId })
        } else {
            exampleResult = new ExampleResult({ parentId: undefined! })
        }

        return {
            component: DialogCreate,
            componentProps: {
                service: this,
                initialRecord: exampleResult,
                formComponents: [
                    { component: FormItemId },
                    { component: FormItemParentId, props: { parentService: this.parentService() } },
                    { component: FormItemCreatedDate },
                    { component: FormItemNote },
                    { component: FormItemMockData },
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the edit dialog.
     * @example $q.dialog(service.editDialogOptions(id))
     */
    editDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogEdit,
            componentProps: {
                id,
                service: this,
                formComponents: [
                    { component: FormItemId },
                    { component: FormItemParentId, props: { parentService: this.parentService() } },
                    { component: FormItemCreatedDate },
                    { component: FormItemNote },
                    { component: FormItemMockData },
                ],
            },
        }
    }

    /**
     * Returns QDialogOptions options for the delete dialog.
     * @example $q.dialog(service.deleteDialogOptions(id))
     */
    deleteDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogDelete,
            componentProps: {
                id,
                service: this,
                useUnlock: 'ADVANCED-MODE-CONTROLLED',
            },
        }
    }

    /**
     * Returns live query of records ordered by creation date.
     */
    liveTable(): Observable<ExampleResultType[]>
    liveTable(): Observable<Record<string, any>[]>
    liveTable(): Observable<ExampleResultType[] | Record<string, any>[]> {
        return liveQuery(() =>
            this.db.table(TableEnum.EXAMPLE_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns chart datasets for the record associated with a parent.
     */
    async getChartDatasets(parentId: IdType) {
        const allExampleResults = await this.db
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
     * Returns record by ID.
     */
    async get(id: IdType): Promise<ExampleResultType>
    async get(id: IdType): Promise<Record<string, any>>
    async get(id: IdType): Promise<ExampleResultType | Record<string, any>> {
        const recordToGet = await this.db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        if (!recordToGet) {
            throw new Error(`Example Result ID not found: ${id}`)
        }
        return recordToGet
    }

    /**
     * Creates a new record and updates the parent `lastChild` property.
     */
    async add(record: ExampleResultType): Promise<ExampleResultType>
    async add(record: ExampleResultType): Promise<Record<string, any>>
    async add(record: ExampleResultType): Promise<ExampleResultType | Record<string, any>> {
        const validatedRecord = exampleResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXAMPLE_RESULTS),
            this.db.table(TableEnum.EXAMPLES),
            async () => {
                await this.db.table(TableEnum.EXAMPLE_RESULTS).add(validatedRecord)
                await this.updateLastChild(validatedRecord.parentId)
            },
        )
        return validatedRecord
    }

    /**
     * Creates or overwrites a child record and updates the parent record's `lastChild` property.
     */
    async put(record: ExampleResultType): Promise<ExampleResultType>
    async put(record: ExampleResultType): Promise<Record<string, any>>
    async put(record: ExampleResultType): Promise<ExampleResultType | Record<string, any>> {
        const validatedRecord = exampleResultSchema.parse(record)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXAMPLE_RESULTS),
            this.db.table(TableEnum.EXAMPLES),
            async () => {
                await this.db.table(TableEnum.EXAMPLE_RESULTS).put(validatedRecord)
                await this.updateLastChild(validatedRecord.parentId)
            },
        )
        return validatedRecord
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async remove(id: IdType): Promise<ExampleResultType>
    async remove(id: IdType): Promise<Record<string, any>>
    async remove(id: IdType): Promise<ExampleResultType | Record<string, any>> {
        const recordToDelete = await this.db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        await this.db.transaction(
            'rw',
            this.db.table(TableEnum.EXAMPLE_RESULTS),
            this.db.table(TableEnum.EXAMPLES),
            async () => {
                await this.db.table(TableEnum.EXAMPLE_RESULTS).delete(id)
                await this.updateLastChild(recordToDelete.parentId)
            },
        )
        return recordToDelete
    }

    /**
     * Imports record into the database using put and returns a results object.
     */
    async importData(records: ExampleResultType[]) {
        const validRecords: ExampleResultType[] = []
        const invalidRecords: Partial<ExampleResultType>[] = []

        // Validate each record
        records.forEach((record) => {
            if (exampleResultSchema.safeParse(record).success) {
                validRecords.push(exampleResultSchema.parse(record)) // Clean record with parse
            } else {
                invalidRecords.push(record)
            }
        })

        // Put validated record into the database
        let bulkError: Record<string, string> = null!
        try {
            await this.db.table(TableEnum.EXAMPLE_RESULTS).bulkAdd(validRecords)
        } catch (error) {
            bulkError = {
                name: (error as Error)?.name,
                message: (error as Error)?.message,
            }
        }

        // Update parent lastChild property
        const parentIds = Array.from(new Set(validRecords.map((record) => record.parentId)))
        await Promise.all(parentIds.map((parentId) => this.updateLastChild(parentId)))

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
     * most recently created child model. Locked records are not updated.
     */
    async updateLastChild(parentId: IdType) {
        const lastChild = (
            await this.db
                .table(TableEnum.EXAMPLE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((record) => !record.status.includes(StatusEnum.LOCKED))
            .reverse()[0]

        await this.db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Generates an options list of record for select box components on the FE.
     */
    async getSelectOptions(): Promise<SelectOption[]> {
        const records = await this.db
            .table(TableEnum.EXAMPLE_RESULTS)
            .orderBy('createdAt')
            .reverse()
            .toArray()

        return records.map((record) => {
            const id = truncateText(record.id, 8, '*')
            const parentId = truncateText(record.parentId, 8, '*')
            const locked = record.status.includes(StatusEnum.LOCKED) ? '🔒' : ''
            const disable = record.status.includes(StatusEnum.LOCKED)

            return {
                value: record.id as IdType,
                label: `${id} (${parentId}) ${locked}`,
                disable,
            }
        })
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default ExampleResultService.instance()
