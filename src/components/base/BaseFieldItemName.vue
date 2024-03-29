<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    value?: string
}>()

const test = ref(props.value || '')
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Name</q-item-label>
            <q-item-label>Customizable text name for the record.</q-item-label>
            <q-item-label caption>
                <q-input outlined dense v-model="test" class="full-width" />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
