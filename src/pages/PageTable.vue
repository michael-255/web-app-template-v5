<script setup lang="ts">
import BaseTable from '@/components/table/BaseTable.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import { childTableIcon, logsTableIcon, parentTableIcon, settingsTableIcon } from '@/shared/icons'
import type { DBRecordType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import type { Subscription } from 'dexie'
import { useMeta } from 'quasar'
import { onMounted, onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Data Table` })

const { log } = useLogger()
const { routeTable } = useRouting()
const { goToCreate, goToEdit } = useRouting()
const { onInspectDialog, onDeleteRecord } = useActions()

const settingColumns = [tableColumn('id', 'Id'), tableColumn('value', 'Value')]
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

// Using dummy subscription for typing and preventing unsubscribe errors
let subscription = {
    unsubscribe: () => undefined,
} as Subscription

const liveDataRows: Ref<DBRecordType[]> = ref([])

onMounted(async () => {
    subscription = DB.liveTable(routeTable!).subscribe({
        next: (records) => (liveDataRows.value = records),
        error: (error) => log.error('Error fetching live data', error as Error),
    })
})

onUnmounted(() => {
    subscription?.unsubscribe()
})
</script>

<template>
    <BaseTable
        v-if="routeTable === TableEnum.SETTINGS"
        title="Settings"
        :icon="settingsTableIcon"
        :liveRows="liveDataRows"
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
        :liveRows="liveDataRows"
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
        :liveRows="liveDataRows"
        :tableColumns="exampleColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        :hasActions="true"
        @onCreate="goToCreate(TableEnum.EXAMPLES)"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectDialog($event)"
        @onEdit="goToEdit($event)"
        @onDelete="onDeleteRecord($event)"
    />

    <BaseTable
        v-else-if="routeTable === TableEnum.EXAMPLE_RESULTS"
        title="Example Results"
        :icon="childTableIcon"
        :liveRows="liveDataRows"
        :tableColumns="exampleResultColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        :hasActions="true"
        @onCreate="goToCreate(TableEnum.EXAMPLE_RESULTS)"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectDialog($event)"
        @onEdit="goToEdit($event)"
        @onDelete="onDeleteRecord($event)"
    />
</template>
