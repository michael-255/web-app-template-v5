<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    value?: any
}>()

const test = ref(['Test1', 'Test2', 'Test3'])
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Tags</q-item-label>
            <q-item-label>
                Tags associated with the record that effect it's current status.
            </q-item-label>
            <q-item-label caption>
                <q-select outlined dense v-model="test" class="full-width" />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
