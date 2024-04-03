<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import { appName } from '@/shared/constants'
import { parentTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useLiveStore from '@/stores/live'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples Data Table` })

const { log } = useLogger()
const liveStore = useLiveStore()
const { onCreateExample, onInspectExample, onEditExample, onDeleteExample } = useActions()

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChildCreatedAt', 'Last Result Date', 'DATE'),
    tableColumn('lastChildNote', 'Last Result Note', 'TEXT'),
]
</script>

<template>
    <BaseTable
        title="Examples"
        :icon="parentTableIcon"
        rowKey="id"
        :liveRows="liveStore.examples"
        :tableColumns="tableColumns"
        :hasColumnFilters="true"
        :hasCreate="true"
        :hasCharts="true"
        :hasInspect="true"
        :hasEdit="true"
        :hasDelete="true"
        @onCreate="onCreateExample()"
        @onCharts="log.debug('Not Implemented', { action: 'onCharts', event: $event })"
        @onInspect="onInspectExample($event)"
        @onEdit="onEditExample($event)"
        @onDelete="onDeleteExample($event)"
    />
</template>
