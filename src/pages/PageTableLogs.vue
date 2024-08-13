<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import LogsService from '@/services/LogsService'
import { logsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'

const { log } = useLogger(DB)
const logsService = LogsService(DB)

const tableColumns = [
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto Id'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'TEXT'),
    tableColumn('details', 'Details', 'JSON'),
]
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
        :onChartsDialog="() => log.error('Charts not supported')"
        :onInspectDialog="() => log.error('Inspect not supported')"
        :onCreateDialog="() => log.error('Create not supported')"
        :onEditDialog="() => log.error('Edit not supported')"
        :onDeleteDialog="() => log.error('Delete not supported')"
    />
</template>
