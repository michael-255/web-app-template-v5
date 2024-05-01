<script setup lang="ts">
defineProps<{
    title: string
    messages: string[]
    hasButton: boolean
    buttonLabel: string
    buttonColor: string
}>()
// TODO: Find a way to have it fade in after 1 second?
const emits = defineEmits(['onButtonAction'])
</script>

<template>
    <q-card>
        <q-card-section class="text-h6">{{ title }}</q-card-section>

        <q-card-section v-for="(message, i) in messages" :key="i">
            {{ message }}
        </q-card-section>

        <q-card-actions v-if="hasButton">
            <q-btn
                :color="buttonColor"
                :label="buttonLabel"
                class="full-width"
                @click="emits('onButtonAction')"
            />
        </q-card-actions>
    </q-card>
</template>
