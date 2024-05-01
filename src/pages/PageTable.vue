<script setup lang="ts">
import BaseTable from '@/components/table/BaseTable.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import { childTableIcon, logsTableIcon, parentTableIcon, settingsTableIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import { compactDateFromMs, truncateText } from '@/shared/utils'
import { useMeta, type QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Data Table` })

const { log } = useLogger()
const { routeTable } = useRouting()
const { onInspectDialog, onDeleteDialog, onCreateDialog, onEditDialog } = useActions()

const settingColumns = [
    tableColumn('id', 'Id'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('value', 'Value'),
]
const logColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'TEXT'),
    tableColumn('details', 'Details', 'JSON'),
]
const exampleColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChildCreatedAt', 'Last Result Date', 'DATE'),
    tableColumn('lastChildNote', 'Last Result Note', 'TEXT'),
]
const exampleResultColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
]

const liveRecords: Ref<ModelType[]> = ref([])

const subscription = DatabaseManager.getService(routeTable!)
    .liveTable(DB)
    .subscribe({
        next: (records) => (liveRecords.value = records),
        error: (error) => log.error('Error loading live data', error as Error),
    })

onUnmounted(() => {
    subscription.unsubscribe()
})

/**
 * Create a hidden `QTableColumn`. Use this to hide a column that may be needed for `QTable` row
 * props, but should not be visible in the UI (normally `id`).
 * @param rowPropertyName Name of the property on the record for this column
 * @returns `QTableColumn`
 */
function hiddenTableColumn(rowPropertyName: string): QTableColumn {
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
function tableColumn(
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
</script>

<template>
    <BaseTable
        v-if="routeTable === TableEnum.SETTINGS"
        title="Settings"
        :icon="settingsTableIcon"
        :liveRows="liveRecords"
        :tableColumns="settingColumns"
        :hasColumnFilters="false"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="false"
        :hasEdit="false"
        :hasDelete="false"
        :hasActions="false"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="log.error('Action not supported', { action: 'onInspect' })"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />

    <BaseTable
        v-else-if="routeTable === TableEnum.LOGS"
        title="Logs"
        :icon="logsTableIcon"
        :liveRows="liveRecords"
        :tableColumns="logColumns"
        :hasColumnFilters="true"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="true"
        :hasEdit="false"
        :hasDelete="false"
        :hasActions="true"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="onInspectDialog($event)"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />

    <BaseTable
        v-else-if="routeTable === TableEnum.EXAMPLES"
        title="Examples"
        :icon="parentTableIcon"
        :liveRows="liveRecords"
        :tableColumns="exampleColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        :hasActions="true"
        @onCreate="onCreateDialog(TableEnum.EXAMPLES)"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectDialog($event)"
        @onEdit="onEditDialog($event)"
        @onDelete="onDeleteDialog($event)"
    />

    <BaseTable
        v-else-if="routeTable === TableEnum.EXAMPLE_RESULTS"
        title="Example Results"
        :icon="childTableIcon"
        :liveRows="liveRecords"
        :tableColumns="exampleResultColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        :hasActions="true"
        @onCreate="onCreateDialog(TableEnum.EXAMPLE_RESULTS)"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectDialog($event)"
        @onEdit="onEditDialog($event)"
        @onDelete="onDeleteDialog($event)"
    />
</template>
