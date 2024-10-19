<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExampleDialogs from '@/composables/useExampleDialogs'
import ExampleService from '@/services/ExampleService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples Data Table` })

const {
    chartExampleDialog,
    inspectExampleDialog,
    createExampleDialog,
    editExampleDialog,
    deleteExampleDialog,
} = useExampleDialogs()
</script>

<template>
    <PageTable
        :labelSingular="ExampleService.labelSingular"
        :labelPlural="ExampleService.labelPlural"
        :icon="ExampleService.tableIcon"
        :tableColumns="ExampleService.tableColumns"
        :supportsColumnFilters="ExampleService.supportsTableColumnFilters"
        :supportsTableCharts="ExampleService.supportsTableCharts"
        :supportsCharts="ExampleService.supportsCharts"
        :supportsInspect="ExampleService.supportsInspect"
        :supportsCreate="ExampleService.supportsCreate"
        :supportsEdit="ExampleService.supportsEdit"
        :supportsDelete="ExampleService.supportsDelete"
        :dataObservable="ExampleService.liveTable()"
        @onCharts="chartExampleDialog"
        @onInspect="inspectExampleDialog"
        @onCreate="createExampleDialog"
        @onEdit="editExampleDialog"
        @onDelete="deleteExampleDialog"
    />
</template>
