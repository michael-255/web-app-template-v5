<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { childTableIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Example Results Data Table` })

const { log } = useLogger()
const { dialogInspect } = useDialogs()

const liveDataRows: Ref<ExampleResult[]> = ref([])
const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('locked', 'Locked', 'BOOL'),
    tableColumn('skipped', 'Skipped', 'BOOL'),
]

const subscription = DB.liveExampleResults().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Example Results', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

/**
 * The row existing means the item will exist in the DB
 */
async function onInspect(id: UUIDType) {
    dialogInspect((await DB.getExampleResult(id))!)
}
</script>

<template>
    <BaseTable
        title="Example Results"
        :icon="childTableIcon"
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
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />
</template>