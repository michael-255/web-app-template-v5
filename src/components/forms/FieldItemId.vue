<script setup lang="ts">
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Id</q-item-label>
            <q-item-label>
                An auto generated value that uniquely identifies the record in the database.
            </q-item-label>
            <q-item-label caption>
                {{ selectedStore.record?.id ?? 'Missing Id' }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
