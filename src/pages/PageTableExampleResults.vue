<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useExampleResultDialogs from '@/composables/useExampleResultDialogs'
import ExampleResultService from '@/services/ExampleResultService'
import { appName } from '@/shared/constants'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Example Results Data Table` })

const {
    inspectExampleResultDialog,
    createExampleResultDialog,
    editExampleResultDialog,
    deleteExampleResultDialog,
} = useExampleResultDialogs()
</script>

<template>
    <PageTable
        :labelSingular="ExampleResultService.labelSingular"
        :labelPlural="ExampleResultService.labelPlural"
        :icon="ExampleResultService.tableIcon"
        :tableColumns="ExampleResultService.tableColumns"
        :supportsColumnFilters="ExampleResultService.supportsTableColumnFilters"
        :supportsTableCharts="ExampleResultService.supportsTableCharts"
        :supportsInspect="ExampleResultService.supportsInspect"
        :supportsCreate="ExampleResultService.supportsCreate"
        :supportsEdit="ExampleResultService.supportsEdit"
        :supportsDelete="ExampleResultService.supportsDelete"
        :dataObservable="ExampleResultService.liveObservable()"
        @onInspect="inspectExampleResultDialog"
        @onCreate="createExampleResultDialog"
        @onEdit="editExampleResultDialog"
        @onDelete="deleteExampleResultDialog"
    />
</template>
