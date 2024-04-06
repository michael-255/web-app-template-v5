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
            <q-item-label v-if="value == true" caption>
                <q-chip color="positive" label="Yes" dense />
            </q-item-label>
            <q-item-label v-else-if="value == false" caption>
                <q-chip color="negative" label="No" dense />
            </q-item-label>
            <q-item-label v-else caption>
                <q-chip color="grey" label="Unknown" dense />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
