<script setup lang="ts">
defineProps<{
    name: 'Id' | 'Auto Id'
    description: string
    value?: string | number
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label>{{ description }}</q-item-label>
            <q-item-label v-if="value" caption>
                {{ value }}
            </q-item-label>
            <q-item-label v-else>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
