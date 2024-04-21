<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import DB from '@/services/Database'
import { TableEnum } from '@/shared/enums'
import type { DBRecordType } from '@/shared/types'
import { decodeId } from '@/shared/utils'

const props = defineProps<{
    model: DBRecordType
}>()

const table = decodeId(props.model.id)?.table
</script>

<template>
    <BaseDialogInspect :title="`Inspect ${DB.getTableLabel(table)}`">
        <q-list v-if="table === TableEnum.LOGS" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Log Level" :value="model.logLevel" />
            <InspectItemDefault name="Label" :value="model.label" />
            <InspectItemObject name="Details" :value="model.details" />
        </q-list>

        <q-list v-else-if="table === TableEnum.EXAMPLES" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Name" :value="model.name" />
            <InspectItemDefault name="Description" :value="model.desc" />
            <InspectItemArray name="Tags" :value="model.tags" />
            <InspectItemObject name="Last Child Record" :value="model.lastChild" />
        </q-list>

        <q-list v-else-if="table === TableEnum.EXAMPLE_RESULTS" padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Example Id" :value="model.parentId" />
            <InspectItemDefault name="Notes" :value="model.note" />
            <InspectItemArray name="Tags" :value="model.tags" />
        </q-list>

        <q-list v-else padding>
            <div>Inspect not supported on table: {{ table }}</div>
        </q-list>
    </BaseDialogInspect>
</template>
