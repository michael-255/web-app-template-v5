<script setup lang="ts">
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Id</q-item-label>

            <q-item-label>
                An auto generated value that uniquely identifies the record in the database.
            </q-item-label>

            <q-item-label caption>
                {{ selectedStore.record?.id ?? '-' }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
