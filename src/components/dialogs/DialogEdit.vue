<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import DatabaseManager from '@/services/DatabaseManager'
import { TableEnum } from '@/shared/enums'
import type { ModelType } from '@/shared/types'

// TODO

const props = defineProps<{
    record: ModelType
}>()

const service = DatabaseManager.getService(props.record.id)
const table = service.table
const label = service.labelSingular
</script>

<template>
    <BaseDialogInspect :title="`Inspect ${label}`">
        <q-list v-if="table === TableEnum.LOGS" padding>
            <InspectItemDefault name="Id" :value="record.id" />
            <InspectItemDate name="Created Date" :value="record.createdAt" />
            <InspectItemDefault name="Log Level" :value="record.logLevel" />
            <InspectItemDefault name="Label" :value="record.label" />
            <InspectItemObject name="Details" :value="record.details" />
        </q-list>

        <q-list v-else-if="table === TableEnum.EXAMPLES" padding>
            <InspectItemDefault name="Id" :value="record.id" />
            <InspectItemDate name="Created Date" :value="record.createdAt" />
            <InspectItemDefault name="Name" :value="record.name" />
            <InspectItemDefault name="Description" :value="record.desc" />
            <InspectItemArray name="Tags" :value="record.tags" />
            <InspectItemObject name="Last Example Result" :value="record.lastChild" />
        </q-list>

        <q-list v-else-if="table === TableEnum.EXAMPLE_RESULTS" padding>
            <InspectItemDefault name="Id" :value="record.id" />
            <InspectItemDate name="Created Date" :value="record.createdAt" />
            <InspectItemDefault name="Example Id" :value="record.parentId" />
            <InspectItemDefault name="Notes" :value="record.note" />
            <InspectItemArray name="Tags" :value="record.tags" />
        </q-list>

        <q-list v-else padding>
            <div>Inspect not supported on {{ service.labelPlural }} table</div>
        </q-list>
    </BaseDialogInspect>
</template>
