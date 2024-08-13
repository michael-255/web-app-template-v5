<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import ExampleResultsService from '@/services/ExampleResultsService'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'

const { log } = useLogger(DB)
const exampleResultsService = ExampleResultsService(DB)

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
]
</script>
<template>
    <PageTable
        labelSingular="Example Result"
        labelPlural="Example Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsActions="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exampleResultsService.liveObservable()"
        :onChartsDialog="log.error('Charts not implemented')"
        :onInspectDialog="log.error('Inspect not implemented')"
        :onCreateDialog="log.error('Create not implemented')"
        :onEditDialog="log.error('Edit not implemented')"
        :onDeleteDialog="log.error('Delete not implemented')"
    />
</template>
