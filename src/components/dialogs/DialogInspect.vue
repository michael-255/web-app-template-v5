<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import { DBTableEnum } from '@/shared/enums'

defineProps<{
    model: Record<string, any>
    type: DBTableEnum
}>()
</script>

<template>
    <BaseDialogInspect v-if="type === DBTableEnum.LOGS" title="Inspect Log">
        <q-list padding>
            <InspectItemDefault name="Auto Id" :value="model.autoId" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Log Level" :value="model.logLevel" />
            <InspectItemDefault name="Label" :value="model.label" />
            <InspectItemObject name="Details" :value="model.details" />
        </q-list>
    </BaseDialogInspect>

    <BaseDialogInspect v-else-if="type === DBTableEnum.EXAMPLES" title="Inspect Example">
        <q-list padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Name" :value="model.name" />
            <InspectItemDefault name="Description" :value="model.desc" />
            <InspectItemArray name="Tags" :value="model.tags" />
            <InspectItemDate name="Last Result Created Date" :value="model.lastChildCreatedAt" />
            <InspectItemDefault name="Last Result Note" :value="model.lastChildNote" />
        </q-list>
    </BaseDialogInspect>

    <BaseDialogInspect
        v-else-if="type === DBTableEnum.EXAMPLE_RESULTS"
        title="Inspect Example Result"
    >
        <q-list padding>
            <InspectItemDefault name="Id" :value="model.id" />
            <InspectItemDate name="Created Date" :value="model.createdAt" />
            <InspectItemDefault name="Example Id" :value="model.parentId" />
            <InspectItemDefault name="Notes" :value="model.note" />
            <InspectItemArray name="Tags" :value="model.tags" />
        </q-list>
    </BaseDialogInspect>
</template>
