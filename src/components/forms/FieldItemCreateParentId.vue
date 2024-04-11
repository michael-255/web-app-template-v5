<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import useSelectedStore from '@/stores/selected'
import { onMounted } from 'vue'

const { log } = useLogger()
const { routeTable, routeId } = useRouting()
const selectedStore = useSelectedStore()

// TODO: Implement parentId component logic (create is special case)
// This will likely be a Select box where you can choose a Parent record

onMounted(async () => {
    // if (routeId) {
    //     // It's an Edit route, so lookup the record
    //     const r = await DB.get
    // }
})
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Parent</q-item-label>

            <q-item-label>
                Id of the parent record that this child record is associated with.
            </q-item-label>

            <q-item-label caption>
                {{ selectedStore.record?.parentId ?? '-' }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
