<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { deleteIcon, parentTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Examples Data Table` })

const { log } = useLogger()
const router = useRouter()
const examplesStore = useExamplesStore()
const { dialogInspect, dialogConfirmStrict } = useDialogs()

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

function onCreate() {
    examplesStore.selectedExample = new Example()
    router.push({ name: RouteNameEnum.CREATE_EXAMPLE })
}

function onInspect(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    const model = examplesStore.examples.find((row) => row.id === eventId)!
    dialogInspect(model)
}

async function onEdit(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    examplesStore.selectedExample = examplesStore.examples.find((row) => row.id === eventId)!
    router.push({ name: RouteNameEnum.EDIT_EXAMPLE })
}

async function onDelete(eventId: string) {
    // Row existing in the table means the item will exist in the DB
    const model = examplesStore.examples.find((row) => row.id === eventId)!

    dialogConfirmStrict(
        'Delete Example',
        `Are you sure you want to delete ${model.name}?`,
        'negative',
        deleteIcon,
        'YES',
        async () => {
            try {
                await DB.deleteExample(eventId)
                log.info(`Deleted Example`, model)
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
        :liveDataRows="examplesStore.examples"
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
