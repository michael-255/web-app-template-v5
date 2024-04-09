<script setup lang="ts">
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()

// TODO: Implement parentId component logic (create is special case)
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Parent Id</q-item-label>

            <q-item-label>Id of the parent record that owns this child record.</q-item-label>

            <q-item-label caption>
                {{ selectedStore.record?.parentId ?? '-' }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
