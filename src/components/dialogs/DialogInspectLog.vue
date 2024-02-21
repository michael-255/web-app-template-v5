<script setup lang="ts">
import BaseDialogInspect from '@/components/base/BaseDialogInspect.vue'
import BaseInspectItemDate from '@/components/base/BaseInspectItemDate.vue'
import BaseInspectItemDefault from '@/components/base/BaseInspectItemDefault.vue'
import BaseInspectItemObject from '@/components/base/BaseInspectItemObject.vue'
import Log from '@/models/Log'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: Log
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Log" :icon="inspectIcon">
        <q-list padding>
            <BaseInspectItemDefault name="Auto Id" :value="model.autoId" />
            <BaseInspectItemDate name="Created Date" :value="model.createdAt" />
            <BaseInspectItemDefault name="Log Level" :value="model.logLevel" />
            <BaseInspectItemDefault name="Label" :value="model.label" />
            <BaseInspectItemObject name="Details" :value="model.details" />
        </q-list>
    </BaseDialogInspect>
</template>
