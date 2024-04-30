<script setup lang="ts">
import { notSupported } from '@/shared/icons'

defineProps<{
    message: string
}>()
</script>

<template>
    <div class="row justify-center">
        <q-icon size="xl" :name="notSupported" />
    </div>

    <div class="row justify-center text-center">
        <div>{{ message }}</div>
    </div>
</template>
