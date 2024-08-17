<script setup lang="ts">
import DialogCreateExample from '@/components/dialogs/create/DialogCreateExample.vue'
import DialogEditExample from '@/components/dialogs/edit/DialogEditExample.vue'
import DialogInspectExample from '@/components/dialogs/inspect/DialogInspectExample.vue'
import PageTable from '@/components/tables/PageTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { appName } from '@/shared/constants'
import { SettingKeyEnum } from '@/shared/enums'
import { databaseIcon, deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { useMeta, useQuasar } from 'quasar'

useMeta({ title: `${appName} - Examples Data Table` })

const $q = useQuasar()
const { log } = useLogger()
const { showDialog, onConfirmDialog, onStrictConfirmDialog } = useDialogs()
const examplesService = ExamplesService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Example Result', 'JSON'),
]

async function inspectDialog(id: string) {
    const record = await examplesService.get(id)
    if (!record) {
        log.error('Example not found')
    }
    selectedStore.example = record
    // Only use this where needed so this component isn't being needlessly imported
    showDialog({ component: DialogInspectExample })
}

async function createDialog() {
    showDialog({ component: DialogCreateExample })
}

async function editDialog() {
    showDialog({ component: DialogEditExample })
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
        const deletedRecord = await examplesService.remove(id)
        log.info(`Deleted Example record`, deletedRecord)
    } catch (error) {
        log.error(`Error deleting Example record`, error as Error)
    } finally {
        $q.loading.hide()
    }
}
</script>

<template>
    <PageTable
        labelSingular="Example"
        labelPlural="Examples"
        :icon="databaseIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="true"
        :supportsCharts="true"
        :supportsInspect="true"
        :supportsCreate="true"
        :supportsEdit="true"
        :supportsDelete="true"
        :dataObservable="examplesService.liveObservable()"
        @onCharts="() => log.error('Charts not implemented')"
        @onInspect="inspectDialog"
        @onCreate="createDialog"
        @onEdit="editDialog"
        @onDelete="deleteDialog"
    />
</template>
