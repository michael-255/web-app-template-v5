<script setup lang="ts">
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Name</q-item-label>
            <q-item-label>Customizable name for the record.</q-item-label>
            <q-item-label caption>
                <QInput
                    v-model="selectedStore.record.name"
                    :rules="[]"
                    type="text"
                    lazy-rules
                    counter
                    dense
                    outlined
                    color="primary"
                    @blur="selectedStore.record.name = selectedStore.record.name?.trim()"
                />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
