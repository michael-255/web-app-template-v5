<script setup lang="ts">
defineProps<{
    name: string
    value?: string | number | null
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label v-if="value" caption>
                {{ value }}
            </q-item-label>
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
