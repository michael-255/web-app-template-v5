<script setup lang="ts">
import DialogCreateExampleResult from '@/components/dialogs/create/DialogCreateExampleResult.vue'
import DialogEditExampleResult from '@/components/dialogs/edit/DialogEditExampleResult.vue'
import DialogInspectExampleResult from '@/components/dialogs/inspect/DialogInspectExampleResult.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResultsService from '@/services/ExampleResultsService'
import { appName } from '@/shared/constants'
import { SettingKeyEnum } from '@/shared/enums'
import { databaseIcon, deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { useMeta, useQuasar } from 'quasar'

useMeta({ title: `${appName} - Example Results Data Table` })

const $q = useQuasar()
const { log } = useLogger()
const { showDialog, onConfirmDialog, onStrictConfirmDialog } = useDialogs()
const exampleResultsService = ExampleResultsService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

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

async function createDialog() {
    showDialog({ component: DialogCreateExampleResult })
}

async function editDialog() {
    showDialog({ component: DialogEditExampleResult })
}

async function deleteDialog(id: IdType) {
    const title = 'Delete Record'
    const message = `Are you sure you want to delete ${id}?`
    const color = 'negative'
    const icon = deleteIcon

    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        onConfirmDialog({
            title,
            message,
            color,
            icon,
            onOk: async () => {
                return await subDeleteDialog(id)
            },
        })
    } else {
        onStrictConfirmDialog({
            title,
            message,
            color,
            icon,
            onOk: async () => {
                return await subDeleteDialog(id)
            },
        })
    }
}

async function subDeleteDialog(id: IdType) {
    try {
        $q.loading.show()
        const deletedRecord = await exampleResultsService.remove(id)
        log.info(`Deleted Example Result record`, deletedRecord)
    } catch (error) {
        log.error(`Error deleting Example Result record`, error as Error)
    } finally {
        $q.loading.hide()
    }
}
</script>

<template>
    <PageTable
        labelSingular="Example Result"
        labelPlural="Example Results"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="exampleResultsService.liveObservable()"
        @onCharts="() => log.error('Charts not implemented')"
        @onInspect="inspectDialog"
        @onCreate="createDialog"
        @onEdit="editDialog"
        @onDelete="deleteDialog"
    />
</template>
