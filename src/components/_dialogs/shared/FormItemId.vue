<script setup lang="ts">
import BaseFormItem from './BaseFormItem.vue'

/**
 * Ids cannot be changed once a record has been created. Because of this we can pass the value as a
 * prop and display it as text.
 */

defineProps<{
    property?: string
}>()
</script>

<template>
    <BaseFormItem
        :label="'Id'"
        :description="'An auto generated value that uniquely identifies this record in the database.'"
    >
        {{ property ?? '-' }}
    </BaseFormItem>
</template>
