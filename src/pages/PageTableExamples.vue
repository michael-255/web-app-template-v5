<script setup lang="ts">
import DialogInspectExample from '@/components/dialogs/inspect/DialogInspectExample.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { databaseIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'

const { log } = useLogger()
const { showDialog } = useDialogs()
const examplesService = ExamplesService()
const selectedStore = useSelectedStore()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Example Result', 'JSON'),
]

async function onInspectDialog(id: string) {
    const record = await examplesService.get(id)
    if (!record) {
        log.error('Example not found')
    }
    selectedStore.example = record
    // Only use this where needed so this component isn't being needlessly imported
    showDialog({ component: DialogInspectExample })
}
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
        @onCharts="() => log.error('Charts not implemented')"
        @onInspect="onInspectDialog"
        @onCreate="() => log.error('Create not implemented')"
        @onEdit="() => log.error('Edit not implemented')"
        @onDelete="() => log.error('Delete not implemented')"
    />
</template>
