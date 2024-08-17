<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>Placeholder</template>
