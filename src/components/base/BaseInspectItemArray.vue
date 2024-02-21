<script setup lang="ts">
defineProps<{
    name: string
    value?: any[]
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label v-if="value && value.length > 0" caption>
                <ul class="q-pl-sm q-mt-none">
                    <li v-for="i in value" :key="i" class="q-ml-sm">{{ i }}</li>
                </ul>
            </q-item-label>
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
