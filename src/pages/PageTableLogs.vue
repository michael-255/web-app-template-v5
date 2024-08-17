<script setup lang="ts">
import DialogInspectLog from '@/components/dialogs/inspect/DialogInspectLog.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import LogsService from '@/services/LogsService'
import { appName } from '@/shared/constants'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Logs Data Table` })

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

async function inspectDialog(id: string) {
    const record = await logsService.get(Number(id)) // Log Auto IDs are numbers
    if (!record) {
        log.error('Log not found')
    }
    selectedStore.log = record
    // Only use this where needed so this component isn't being needlessly imported
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
        :supportsCharts="true"
        :supportsInspect="true"
        :dataObservable="logsService.liveObservable()"
        @onCharts="() => log.error('Charts not implemented')"
        @onInspect="inspectDialog"
    />
</template>
