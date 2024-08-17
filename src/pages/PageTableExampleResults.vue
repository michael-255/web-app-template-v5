<script setup lang="ts">
import DialogInspectExampleResult from '@/components/dialogs/inspect/DialogInspectExampleResult.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResultsService from '@/services/ExampleResultsService'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Example Results Data Table` })

const { log } = useLogger()
const { showDialog } = useDialogs()
const exampleResultsService = ExampleResultsService()
const selectedStore = useSelectedStore()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
]

async function inspectDialog(id: string) {
    const record = await exampleResultsService.get(id)
    if (!record) {
        log.error('Example Result not found')
    }
    selectedStore.exampleResult = record
    // Only use this where needed so this component isn't being needlessly imported
    showDialog({ component: DialogInspectExampleResult })
}
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
        @onCharts="() => log.error('Charts not implemented')"
        @onInspect="inspectDialog"
        @onCreate="() => log.error('Create not implemented')"
        @onEdit="() => log.error('Edit not implemented')"
        @onDelete="() => log.error('Delete not implemented')"
    />
</template>
