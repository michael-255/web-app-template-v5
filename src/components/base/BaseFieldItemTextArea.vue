<script setup lang="ts">
import { ref } from 'vue'

const props = defineProps<{
    name: 'Description' | 'Note'
    value?: string
}>()

const test = ref(props.value || '')
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">{{ name }}</q-item-label>
            <q-item-label v-if="name === 'Description'">
                Customizable text description that explains the Example.
            </q-item-label>
            <q-item-label v-else> Text note associated with this Example Result. </q-item-label>
            <q-item-label caption>
                <q-input outlined dense v-model="test" class="full-width" />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
