<script setup lang="ts">
import type { ModelType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import useFormStore from '@/stores/form'

defineProps<{
    label: string
    field: keyof ModelType
    format: 'List' | 'Boolean' | 'Date' | 'Object' | 'Default'
}>()

const formStore = useFormStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>{{ label }}</q-item-label>

            <!-- Array -->
            <q-item-label v-if="format === 'List' && formStore.record?.[field].length > 0" caption>
                <ul class="q-pl-sm q-my-none">
                    <li v-for="i in formStore.record[field]" :key="i" class="q-ml-sm">{{ i }}</li>
                </ul>
            </q-item-label>

            <!-- Boolean -->
            <q-item-label v-if="format === 'Boolean' && formStore.record?.[field] === true" caption>
                <q-chip color="positive" label="Yes" dense />
            </q-item-label>
            <q-item-label
                v-else-if="format === 'Boolean' && formStore.record?.[field] === false"
                caption
            >
                <q-chip color="negative" label="No" dense />
            </q-item-label>

            <!-- Date -->
            <q-item-label v-if="format === 'Date' && formStore.record?.[field]" caption>
                {{ compactDateFromMs(formStore.record[field]) }}
            </q-item-label>

            <!-- Object -->
            <q-item-label
                v-if="
                    format === 'Object' &&
                    formStore.record?.[field] &&
                    Object.keys(formStore.record[field]).length > 0
                "
                caption
            >
                <ul class="q-pl-sm q-my-none">
                    <li v-for="(v, k) in formStore.record[field]" :key="k" class="q-ml-sm">
                        {{ k }}: {{ v }}
                    </li>
                </ul>
            </q-item-label>

            <!-- Default -->
            <q-item-label v-if="format === 'Default' && formStore.record?.[field]" caption>
                {{ formStore.record[field] }}
            </q-item-label>

            <!-- No Data -->
            <!-- TODO bugs with displaying due to conditionals... -->
            <q-item-label v-else caption>-</q-item-label>
        </q-item-section>
    </q-item>
</template>
