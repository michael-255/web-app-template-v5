<script setup lang="ts">
import BaseDialogInspect from '@/components/base/BaseDialogInspect.vue'
import BaseInspectItemArray from '@/components/base/BaseInspectItemArray.vue'
import BaseInspectItemDate from '@/components/base/BaseInspectItemDate.vue'
import BaseInspectItemDefault from '@/components/base/BaseInspectItemDefault.vue'
import type ExampleResult from '@/models/ExampleResult'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: ExampleResult
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Example Result" :icon="inspectIcon">
        <q-list padding>
            <BaseInspectItemDefault name="Id" :value="model.id" />
            <BaseInspectItemDate name="Created Date" :value="model.createdAt" />
            <BaseInspectItemDefault name="Example Id" :value="model.parentId" />
            <BaseInspectItemDefault name="Notes" :value="model.note" />
            <BaseInspectItemArray name="Tags" :value="model.tags" />
        </q-list>
    </BaseDialogInspect>
</template>
