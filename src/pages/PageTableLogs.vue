<script setup lang="ts">
import DialogInspectLog from '@/components/dialogs/inspect/DialogInspectLog.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import LogsService from '@/services/LogsService'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'

const { log } = useLogger()
const { showDialog } = useDialogs()
const logsService = LogsService()
const selectedStore = useSelectedStore()

const tableColumns = [
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto Id'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'TEXT'),
    tableColumn('details', 'Details', 'JSON'),
]

// TODO - Works good. Move to LogsService?
async function onChartsDialog(id: string) {
    const record = await logsService.get(Number(id)) // Log Auto IDs are numbers
    if (!record) {
        log.error('Log not found')
    }
    selectedStore.log = record
    showDialog({ component: DialogInspectLog })
}
</script>

<template>
    <PageTable
        labelSingular="Log"
        labelPlural="Logs"
        :icon="logsTableIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsActions="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="false"
        :supportsEdit="false"
        :supportsDelete="false"
        :dataObservable="logsService.liveObservable()"
        @onCharts="() => log.error('Charts not supported')"
        @onInspect="onChartsDialog"
        @onCreate="() => log.error('Create not supported')"
        @onEdit="() => log.error('Edit not supported')"
        @onDelete="() => log.error('Delete not supported')"
    />
</template>
