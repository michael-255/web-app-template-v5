<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Log from '@/models/Log'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Logs Data Table` })

const { log } = useLogger()
const { dialogInspect } = useDialogs()

const liveDataRows: Ref<Log[]> = ref([])
const tableColumns = [
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto Id'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'TEXT'),
    tableColumn('details', 'Details', 'JSON'),
]

const subscription = DB.liveLogs().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Logs', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

/**
 * Expecting the event to return the autoId.
 * The row existing in the table means the item will exist in the DB.
 */
async function onInspect(autoId: number) {
    dialogInspect((await DB.getLog(autoId))!)
}
</script>

<template>
    <BaseTable
        title="Logs"
        :icon="logsTableIcon"
        rowKey="autoId"
        :liveDataRows="liveDataRows"
        :tableColumns="tableColumns"
        :hasColumnFilters="true"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="true"
        :hasEdit="false"
        :hasDelete="false"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="onInspect"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />
</template>
