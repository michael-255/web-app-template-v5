<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { childTableIcon, deleteIcon } from '@/shared/icons'
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

// Using a subscription here because this dataset could grow very large
const subscription = DB.liveExampleResults().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Example Results', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

function onCreate() {
    examplesStore.selectedExample = new ExampleResult({
        parentId: examplesStore.examples[0].id,
    })
    router.push({ name: RouteNameEnum.CREATE_EXAMPLE_RESULT })
}

async function onInspect(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    const model = liveDataRows.value.find((row) => row.id === eventId)!
    dialogInspect(model)
}

async function onEdit(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    examplesStore.selectedExampleResult = liveDataRows.value.find((row) => row.id === eventId)!
    router.push({ name: RouteNameEnum.EDIT_EXAMPLE_RESULT })
}

async function onDelete(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    const model = liveDataRows.value.find((row) => row.id === eventId)!

    dialogConfirmStrict(
        'Delete Example Result',
        `Are you sure you want to delete this record?`,
        'negative',
        deleteIcon,
        'YES',
        async () => {
            try {
                await DB.deleteExampleResult(eventId)
                log.info(`Deleted Example Result`, model)
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
        @onCreate="onCreate()"
        @onCharts="log.error('Not Implemented', { action: 'onCharts' })"
        @onInspect="onInspect($event)"
        @onEdit="onEdit($event)"
        @onDelete="onDelete($event)"
    />
</template>
