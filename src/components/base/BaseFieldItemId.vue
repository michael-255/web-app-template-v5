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
            <q-item-label class="text-bold">{{ name }}</q-item-label>
            <q-item-label>{{ description }}</q-item-label>
            <q-item-label caption>
                {{ value }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
