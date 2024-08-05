<script setup lang="ts">
import { compactDateFromMs } from '@/shared/utils'
import BaseInspectItem from './BaseInspectItem.vue'

defineProps<{
    label: string
    property?: number
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property">
            {{ compactDateFromMs(property) }}
        </div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
