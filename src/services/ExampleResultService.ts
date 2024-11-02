import DialogChartActivityExampleResults from '@/components/dialogs/chart/DialogChartActivityExampleResults.vue'
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
import { ExampleResult } from '@/models/ExampleResult'
import { DurationMSEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import { exampleResultSchema } from '@/shared/schemas'
import type { IdType, ServiceType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import type { QDialogOptions } from 'quasar'
import { BaseService } from './BaseService'
import { ExampleService } from './ExampleService'

export class ExampleResultService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Example Result'
    labelPlural = 'Example Results'
    displayIcon = databaseIcon
    tableIcon = databaseIcon
    modelSchema = exampleResultSchema
    parentTable = TableEnum.EXAMPLES
    table = TableEnum.EXAMPLE_RESULTS
    childTable = null!
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
        tableColumn('note', 'Note', 'TEXT'),
        tableColumn('mockData', 'Mock Data'),
        tableColumn('status', 'Status', 'LIST-PRINT'),
    ]
    supportsColumnFilters = true
    supportsActivityCharts = true
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
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.activityChartsDialogOptions(id))
     */
    activityChartsDialogOptions(): QDialogOptions {
        return { component: DialogChartActivityExampleResults }
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
        let record: ExampleResult = null!

        if (parentId) {
            record = new ExampleResult({ parentId })
        } else {
            record = new ExampleResult({ parentId: undefined! })
        }

        return {
            component: DialogCreate,
            componentProps: {
                service: this,
                initialRecord: record,
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
}

/**
 * Singleton instance exported for convenience.
 */
export const ExampleResultServInst = ExampleResultService.instance()
