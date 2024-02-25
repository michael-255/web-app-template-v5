<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { deleteIcon, parentTableIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Examples Data Table` })

const { log } = useLogger()
const router = useRouter()
const examplesStore = useExamplesStore()
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

function onCreate() {
    router.push({ name: RouteNameEnum.CREATE_EXAMPLE })
}

async function onInspect(eventId: UUIDType) {
    // Row existing in the table means the item will exist in the DB
    dialogInspect((await DB.getExample(eventId))!)
}

async function onEdit(eventId: UUIDType) {
    examplesStore.selectedExample = (await DB.getExample(eventId))!
    router.push({ name: RouteNameEnum.EDIT_EXAMPLE })
}

async function onDelete(eventId: UUIDType) {
    // Row existing in the table means the item will exist in the DB
    const record = (await DB.getExample(eventId))!

    dialogConfirmStrict(
        'Delete Example',
        `Delete ${record.name} record?`,
        'negative',
        deleteIcon,
        'YES',
        async () => {
            try {
                await DB.deleteExample(eventId)
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
        @onCreate="onCreate"
        @onCharts="log.error('Not Implemented', { action: 'onCharts' })"
        @onInspect="onInspect"
        @onEdit="onEdit"
        @onDelete="onDelete"
    />
</template>
