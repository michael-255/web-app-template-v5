<script setup lang="ts">
import { useSelectedStore } from '@/stores/selected'
import { computed } from 'vue'
import BaseInspectItem from './BaseInspectItem.vue'

const props = defineProps<{
    label: string
    recordKey: string
}>()

const selectedStore = useSelectedStore()

const property = computed(() => selectedStore.record[props.recordKey])
</script>

<template>
    <BaseInspectItem :label="label">
        <div v-if="property === true" class="text-weight-bold text-positive">Yes</div>
        <div v-else-if="property === false" class="text-weight-bold text-negative">No</div>
        <div v-else>-</div>
    </BaseInspectItem>
</template>
