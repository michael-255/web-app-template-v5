<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExampleResultDialogs from '@/composables/useExampleResultDialogs'
import ExampleResultService from '@/services/ExampleResultService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Example Results Data Table` })

const {
    inspectExampleResultDialog,
    createExampleResultDialog,
    editExampleResultDialog,
    deleteExampleResultDialog,
} = useExampleResultDialogs()
const exampleResultService = ExampleResultService()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('mockData', 'Mock Data'),
    tableColumn('flags', 'Flags', 'LIST-PRINT'),
]
</script>

<template>
    <PageTable
        labelSingular="Example Result"
        labelPlural="Example Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exampleResultService.liveObservable()"
        @onInspect="inspectExampleResultDialog"
        @onCreate="createExampleResultDialog"
        @onEdit="editExampleResultDialog"
        @onDelete="deleteExampleResultDialog"
    />
</template>
