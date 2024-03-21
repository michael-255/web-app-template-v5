<script setup lang="ts">
import BaseDialogInspect from '@/components/base/BaseDialogInspect.vue'
import BaseInspectItemArray from '@/components/base/BaseInspectItemArray.vue'
import BaseInspectItemDate from '@/components/base/BaseInspectItemDate.vue'
import BaseInspectItemDefault from '@/components/base/BaseInspectItemDefault.vue'
import type Example from '@/models/Example'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: Example
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Example" :icon="inspectIcon">
        <q-list padding>
            <BaseInspectItemDefault name="Id" :value="model.id" />
            <BaseInspectItemDate name="Created Date" :value="model.createdAt" />
            <BaseInspectItemDefault name="Name" :value="model.name" />
            <BaseInspectItemDefault name="Description" :value="model.desc" />
            <BaseInspectItemArray name="Tags" :value="model.tags" />
            <BaseInspectItemDate
                name="Last Result Created Date"
                :value="model.lastChildCreatedAt"
            />
            <BaseInspectItemDefault name="Last Result Note" :value="model.lastChildNote" />
        </q-list>
    </BaseDialogInspect>
</template>
