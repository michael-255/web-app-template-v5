<script setup lang="ts">
import BaseMutationDialog from '@/components/dialogs/shared/BaseMutationDialog.vue'
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseMutationDialog heading="Create Example"> Testing </BaseMutationDialog>
</template>
