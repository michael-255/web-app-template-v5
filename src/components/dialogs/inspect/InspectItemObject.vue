<script setup lang="ts">
import type { ModelType } from '@/shared/types'

defineProps<{
    name: string
    value?: ModelType
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ name }}</q-item-label>
            <q-item-label v-if="value && Object.keys(value).length > 0" caption>
                <ul class="q-pl-sm q-my-none">
                    <li v-for="(v, k) in value" :key="k" class="q-ml-sm">{{ k }}: {{ v }}</li>
                </ul>
            </q-item-label>
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
