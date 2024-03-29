<script setup lang="ts">
defineProps<{
    name: 'Id' | 'Auto Id'
    value?: string
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">{{ name }}</q-item-label>
            <q-item-label>
                Uniquely identifies the record in the database. This is auto generated for you.
            </q-item-label>
            <q-item-label caption>
                {{ value }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
