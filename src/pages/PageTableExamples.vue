<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { deleteIcon, parentTableIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Examples Data Table` })

const { log } = useLogger()
const { dialogInspect, dialogConfirmStrict } = useDialogs()

const liveDataRows: Ref<Example[]> = ref([])
const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('locked', 'Locked', 'BOOL'),
    tableColumn('favorited', 'Favorited', 'BOOL'),
    tableColumn('enabled', 'Enabled', 'BOOL'),
    tableColumn('lastChildCreatedAt', 'Last Result Date', 'DATE'),
    tableColumn('lastChildNote', 'Last Result Note', 'TEXT'),
]

const subscription = DB.liveExamples().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Examples', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

/**
 * Expecting the event to return the id.
 * The row existing in the table means the item will exist in the DB.
 */
async function onInspect(id: UUIDType) {
    dialogInspect((await DB.getExample(id))!)
}

/**
 * The row existing in the table means the item will exist in the DB.
 */
async function onDelete(id: UUIDType) {
    const record = (await DB.getExample(id))!

    dialogConfirmStrict(
        'Delete Example',
        `Delete ${record.name} record?`,
        'negative',
        deleteIcon,
        'DELETE',
        async () => {
            try {
                await DB.deleteExample(id)
                log.info(`Deleted Example`, record)
            } catch (error) {
                log.error(`Error deleting Example`, error as Error)
            }
        },
    )
}
</script>

<template>
    <BaseTable
        title="Examples"
        :icon="parentTableIcon"
        rowKey="id"
        :liveDataRows="liveDataRows"
        :tableColumns="tableColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="onInspect"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="onDelete"
    />
</template>
