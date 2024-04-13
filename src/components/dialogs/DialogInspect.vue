<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/Database'
import { DBTableEnum } from '@/shared/enums'
import type { UUIDType } from '@/shared/types'
import { getTableLabel } from '@/shared/utils'
import { onMounted, ref } from 'vue'

const props = defineProps<{
    table: Exclude<DBTableEnum, DBTableEnum.SETTINGS>
    id: UUIDType
}>()

const { log } = useLogger()

const model = ref({} as Record<string, any>)

onMounted(async () => {
    model.value = (await DB.getRecord(props.table, props.id)) ?? {}

    if (Object.keys(model.value).length === 0) {
        log.error('Failed to load record', { table: props.table, id: props.id })
    }
})
</script>

<template>
    <BaseDialogInspect :title="`Inspect ${getTableLabel(table)}`">
        <q-list v-if="table === DBTableEnum.LOGS" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Log Level" :value="model.logLevel" />
            <InspectItemDefault name="Label" :value="model.label" />
            <InspectItemObject name="Details" :value="model.details" />
        </q-list>

        <q-list v-else-if="table === DBTableEnum.EXAMPLES" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Name" :value="model.name" />
            <InspectItemDefault name="Description" :value="model.desc" />
            <InspectItemArray name="Tags" :value="model.tags" />
            <InspectItemDate name="Last Result Created Date" :value="model.lastChildCreatedAt" />
            <InspectItemDefault name="Last Result Note" :value="model.lastChildNote" />
        </q-list>

        <q-list v-else-if="table === DBTableEnum.EXAMPLE_RESULTS" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Example Id" :value="model.parentId" />
            <InspectItemDefault name="Notes" :value="model.note" />
            <InspectItemArray name="Tags" :value="model.tags" />
        </q-list>

        <q-list v-else padding>
            <div>Action not supported on this type.</div>
        </q-list>
    </BaseDialogInspect>
</template>
