<script setup lang="ts">
defineProps<{
    value?: string
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Id</q-item-label>
            <q-item-label>
                Uniquely identifies the record in the database. This is auto generated for you.
            </q-item-label>
            <q-item-label caption>
                {{ value }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
