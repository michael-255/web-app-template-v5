<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { childTableIcon, deleteIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Example Results Data Table` })

const { log } = useLogger()
const router = useRouter()
const examplesStore = useExamplesStore()
const { dialogInspect, dialogConfirmStrict } = useDialogs()

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

function onCreate() {
    router.push({ name: RouteNameEnum.CREATE_EXAMPLE_RESULT })
}

async function onInspect(eventId: UUIDType) {
    // Row existing in the table means the item will exist in the DB
    dialogInspect((await DB.getExampleResult(eventId))!)
}

async function onEdit(eventId: UUIDType) {
    // Row existing in the table means the item will exist in the DB
    examplesStore.selectedExampleResult = (await DB.getExampleResult(eventId))!
    router.push({ name: RouteNameEnum.EDIT_EXAMPLE_RESULT })
}

async function onDelete(eventId: UUIDType) {
    // Row existing in the table means the item will exist in the DB
    const record = (await DB.getExampleResult(eventId))!

    dialogConfirmStrict(
        'Delete Example Result',
        `Delete record?`,
        'negative',
        deleteIcon,
        'YES',
        async () => {
            try {
                await DB.deleteExampleResult(eventId)
                log.info(`Deleted Example Result`, record)
            } catch (error) {
                log.error(`Error deleting Example Result`, error as Error)
            }
        },
    )
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
        @onCreate="onCreate"
        @onCharts="log.error('Not Implemented', { action: 'onCharts' })"
        @onInspect="onInspect"
        @onEdit="onEdit"
        @onDelete="onDelete"
    />
</template>
