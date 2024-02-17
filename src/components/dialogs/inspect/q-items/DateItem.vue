<script setup lang="ts">
import { compactDateFromMs } from '@/shared/utils'

defineProps<{
    name: string
    value?: number
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label v-if="value" caption>
                {{ compactDateFromMs(value) }}
            </q-item-label>
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
