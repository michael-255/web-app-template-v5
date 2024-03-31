<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    value?: number
}>()

const test = ref(props.value || 0)
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Created Date</q-item-label>
            <q-item-label>
                Date the record was created. This can be changed if needed.
            </q-item-label>
            <q-item-label caption>
                <q-input outlined dense v-model="test" class="full-width" />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
