<script setup lang="ts">
defineProps<{
    title: string
    messages: string[]
    hasEmptyAction: boolean
}>()

const emits = defineEmits(['onEmptyAction'])
</script>

<template>
    <q-card>
        <q-card-section class="text-h6">{{ title }}</q-card-section>

        <q-card-section v-for="(message, i) in messages" :key="i">
            {{ message }}
        </q-card-section>

        <q-card-actions v-if="hasEmptyAction">
            <q-btn
                color="primary"
                label="Empty Action"
                class="full-width"
                @click="emits('onEmptyAction')"
            />
        </q-card-actions>
    </q-card>
</template>
