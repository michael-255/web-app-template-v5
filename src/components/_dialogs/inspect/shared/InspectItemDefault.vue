<script setup lang="ts">
import BaseInspectItem from './BaseInspectItem.vue'

defineProps<{
    label: string
    property?: any // Will cast to a string
}>()
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property">{{ property }}</div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
