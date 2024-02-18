<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import ItemBoolean from '@/components/dialogs/inspect/ItemBoolean.vue'
import ItemDate from '@/components/dialogs/inspect/ItemDate.vue'
import ItemDefault from '@/components/dialogs/inspect/ItemDefault.vue'
import type ExampleResult from '@/models/ExampleResult'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: ExampleResult
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Example Result" :icon="inspectIcon">
        <q-list padding>
            <ItemDefault name="Id" :value="model.id" />
            <ItemDate name="Created Date" :value="model.createdAt" />
            <ItemDefault name="Config Id" :value="model.configId" />
            <ItemDefault name="Notes" :value="model.notes" />
            <ItemBoolean name="Activated" :value="model.activated" />
            <ItemBoolean name="Skipped" :value="model.skipped" />
        </q-list>
    </BaseDialogInspect>
</template>
