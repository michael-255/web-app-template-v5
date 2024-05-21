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

            <q-item-label caption>
                <div v-if="format === 'List'">
                    <ul v-if="formStore.record?.[field].length > 0" class="q-pl-sm q-my-none">
                        <li v-for="i in formStore.record[field]" :key="i" class="q-ml-sm">
                            {{ i }}
                        </li>
                    </ul>

                    <div v-else>-</div>
                </div>

                <div v-else-if="format === 'Boolean'">
                    <q-chip
                        v-if="formStore.record?.[field] === true"
                        color="positive"
                        label="Yes"
                        dense
                    />
                    <q-chip
                        v-else-if="formStore.record?.[field] === false"
                        color="negative"
                        label="No"
                        dense
                    />
                    <div v-else>-</div>
                </div>

                <div v-else-if="format === 'Date'">
                    <div v-if="formStore.record?.[field]">
                        {{ compactDateFromMs(formStore.record[field]) }}
                    </div>
                    <div v-else>-</div>
                </div>

                <div v-else-if="format === 'Object'">
                    <ul
                        v-if="
                            formStore.record?.[field] &&
                            Object.keys(formStore.record[field]).length > 0
                        "
                        class="q-pl-sm q-my-none"
                    >
                        <li v-for="(v, k) in formStore.record[field]" :key="k" class="q-ml-sm">
                            {{ k }}: {{ v }}
                        </li>
                    </ul>
                    <div v-else>-</div>
                </div>

                <div v-else-if="format === 'Default'">
                    <div v-if="formStore.record?.[field]">{{ formStore.record[field] }}</div>
                    <div v-else>-</div>
                </div>

                <div v-else>-</div>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
