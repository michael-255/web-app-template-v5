<script setup lang="ts">
import BaseDialogInspect from '@/components/dialogs/inspect/BaseDialogInspect.vue'
import ItemArray from '@/components/dialogs/inspect/ItemArray.vue'
import ItemBoolean from '@/components/dialogs/inspect/ItemBoolean.vue'
import ItemDate from '@/components/dialogs/inspect/ItemDate.vue'
import ItemDefault from '@/components/dialogs/inspect/ItemDefault.vue'
import type Example from '@/models/Example'
import { inspectIcon } from '@/shared/icons'

defineProps<{
    model: Example
}>()
</script>

<template>
    <BaseDialogInspect title="Inspect Example" :icon="inspectIcon">
        <q-list padding>
            <ItemDefault name="Id" :value="model.id" />
            <ItemDate name="Created Date" :value="model.createdAt" />
            <ItemDefault name="Name" :value="model.name" />
            <ItemDefault name="Description" :value="model.desc" />
            <ItemArray name="Tags" :value="model.tags" />
            <ItemBoolean name="Activated" :value="model.activated" />
            <ItemBoolean name="Favorited" :value="model.favorited" />
            <ItemBoolean name="Enabled" :value="model.enabled" />
        </q-list>
    </BaseDialogInspect>
</template>
@/models/Example
