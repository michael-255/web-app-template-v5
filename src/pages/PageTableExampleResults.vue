<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { childTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Example Results Data Table` })

const { log } = useLogger()
const {
    onCreateExampleResult,
    onInspectExampleResult,
    onEditExampleResult,
    onDeleteExampleResult,
} = useActions()

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

// Using a subscription here because this dataset could grow very large
const subscription = DB.liveExampleResults().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Example Results', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})
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
        @onCreate="onCreateExampleResult()"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectExampleResult(liveDataRows, $event)"
        @onEdit="onEditExampleResult(liveDataRows, $event)"
        @onDelete="onDeleteExampleResult(liveDataRows, $event)"
    />
</template>
