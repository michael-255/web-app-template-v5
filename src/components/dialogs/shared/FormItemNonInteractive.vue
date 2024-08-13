<script setup lang="ts">
import BaseFormItem from './BaseFormItem.vue'

/**
 * For any value you want included in the form, but not editable. Ideal for IDs.
 */

defineProps<{
    label: string
    description: string
    property?: string
}>()
</script>

<template>
    <BaseFormItem :label="label" :description="description">
        {{ property ?? '-' }}
    </BaseFormItem>
</template>
