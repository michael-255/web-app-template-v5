<script setup lang="ts">
import BaseTable from '@/components/table/BaseTable.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import type ExampleResult from '@/models/ExampleResult'
import type Log from '@/models/Log'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { DBTableEnum } from '@/shared/enums'
import { childTableIcon, logsTableIcon, parentTableIcon, settingsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useLiveStore from '@/stores/live'
import type { Subscription } from 'dexie'
import { useMeta } from 'quasar'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Data Table` })

const { log } = useLogger()
const liveStore = useLiveStore()
const { routeTable } = useRouting()
const {
    onInspectLog,
    onInspectExample,
    onInspectExampleResult,
    onCreateExample,
    onEditExample,
    onDeleteExample,
    onCreateExampleResult,
    onEditExampleResult,
    onDeleteExampleResult,
} = useActions()

const settingColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
const logColumns = [
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto Id'),
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

// Using dummy subscription for typing and preventing unsubscribe errors
let subscription = {
    unsubscribe: () => undefined,
} as Subscription

const liveLogRows: Ref<Log[]> = ref([])
const liveExampleResultRows: Ref<ExampleResult[]> = ref([])

onMounted(async () => {
    // Use the subscription if needed by the selected route table
    if (routeTable === DBTableEnum.LOGS) {
        subscription = DB.liveLogs().subscribe({
            next: (records) => (liveLogRows.value = records),
            error: (error) => log.error('Error fetching live Logs', error as Error),
        })
    } else if (routeTable === DBTableEnum.EXAMPLE_RESULTS) {
        subscription = DB.liveExampleResults().subscribe({
            next: (records) => (liveExampleResultRows.value = records),
            error: (error) => log.error('Error fetching live Example Results', error as Error),
        })
    }
})

onUnmounted(() => {
    subscription?.unsubscribe()
})
</script>

<template>
    <BaseTable
        v-if="routeTable === DBTableEnum.SETTINGS"
        title="Settings"
        :icon="settingsTableIcon"
        rowKey="key"
        :liveRows="liveStore.settings"
        :tableColumns="settingColumns"
        :hasColumnFilters="false"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="false"
        :hasEdit="false"
        :hasDelete="false"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="log.error('Action not supported', { action: 'onInspect' })"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />

    <BaseTable
        v-else-if="routeTable === DBTableEnum.LOGS"
        title="Logs"
        :icon="logsTableIcon"
        rowKey="autoId"
        :liveRows="liveLogRows"
        :tableColumns="logColumns"
        :hasColumnFilters="true"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="true"
        :hasEdit="false"
        :hasDelete="false"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="onInspectLog($event, liveLogRows)"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />

    <BaseTable
        v-else-if="routeTable === DBTableEnum.EXAMPLES"
        title="Examples"
        :icon="parentTableIcon"
        rowKey="id"
        :liveRows="liveStore.examples"
        :tableColumns="exampleColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        @onCreate="onCreateExample()"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectExample($event)"
        @onEdit="onEditExample($event)"
        @onDelete="onDeleteExample($event)"
    />

    <BaseTable
        v-else-if="routeTable === DBTableEnum.EXAMPLE_RESULTS"
        title="Example Results"
        :icon="childTableIcon"
        rowKey="id"
        :liveRows="liveExampleResultRows"
        :tableColumns="exampleResultColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        @onCreate="onCreateExampleResult()"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectExampleResult($event, liveExampleResultRows)"
        @onEdit="onEditExampleResult($event)"
        @onDelete="onDeleteExampleResult($event, liveExampleResultRows)"
    />
</template>
