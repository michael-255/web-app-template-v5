<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import ExamplesService from '@/services/ExamplesService'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'

const { log } = useLogger(DB)
const examplesService = ExamplesService(DB)

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Example Result', 'JSON'),
]
</script>

<template>
    <PageTable
        labelSingular="Example"
        labelPlural="Examples"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsActions="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="examplesService.liveObservable()"
        :onChartsDialog="() => log.error('Charts not implemented')"
        :onInspectDialog="() => log.error('Inspect not implemented')"
        :onCreateDialog="() => log.error('Create not implemented')"
        :onEditDialog="() => log.error('Edit not implemented')"
        :onDeleteDialog="() => log.error('Delete not implemented')"
    />
</template>
