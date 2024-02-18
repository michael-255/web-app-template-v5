<script setup lang="ts">
defineProps<{
    name: string
    value?: boolean
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label v-if="value == true" caption>Yes</q-item-label>
            <q-item-label v-else-if="value == false" caption>No</q-item-label>
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
