<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import ItemDate from '@/components/dialogs/inspect/ItemDate.vue'
import ItemDefault from '@/components/dialogs/inspect/ItemDefault.vue'
import ItemObject from '@/components/dialogs/inspect/ItemObject.vue'
import Log from '@/models/Log'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: Log
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Log" :icon="inspectIcon">
        <q-list padding>
            <ItemDefault name="Auto Id" :value="model.autoId" />
            <ItemDate name="Created Date" :value="model.createdAt" />
            <ItemDefault name="Log Level" :value="model.logLevel" />
            <ItemDefault name="Label" :value="model.label" />
            <ItemObject name="Details" :value="model.details" />
        </q-list>
    </BaseDialogInspect>
</template>
