<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DB from '@/services/Database'
import { getParentTable, getTableLabel } from '@/shared/db-utils'
import { idSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { onMounted, ref, type Ref } from 'vue'

defineProps<{
    mutation: 'Create' | 'Edit'
}>()

const { log } = useLogger()
const { routeTable, routeParentId } = useRouting()
const selectedStore = useSelectedStore()

const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        // Set parentId to routeParentId if it exists
        if (routeParentId) {
            selectedStore.record.parentId = routeParentId
        }

        options.value = await DB.getTableOptions(getParentTable(routeTable!))

        const parentIdMatch = options.value.some((i) => i.value === selectedStore.record.parentId)

        if (!parentIdMatch) {
            selectedStore.record.parentId = undefined // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading ParentId field', error as Error)
    }
})
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">
                Parent {{ getTableLabel(getParentTable(routeTable!)) }} Id
            </q-item-label>

            <q-item-label>
                Id of the parent record that this child record is associated with.
            </q-item-label>

            <q-item-label v-if="mutation == 'Edit'" caption class="q-mb-md">
                {{ selectedStore.record?.parentId ?? '-' }}
            </q-item-label>

            <q-item-label v-else caption>
                <q-select
                    v-model="selectedStore.record.parentId"
                    :rules="[(val: string) => idSchema.safeParse(val).success || 'Required']"
                    :options="options"
                    lazy-rules
                    emit-value
                    map-options
                    options-dense
                    dense
                    outlined
                    color="primary"
                />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
