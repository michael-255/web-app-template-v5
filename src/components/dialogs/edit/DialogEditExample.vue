<script setup lang="ts">
import BaseMutationDialog from '@/components/dialogs/shared/BaseMutationDialog.vue'
import FormItemNonInteractive from '@/components/dialogs/shared/FormItemNonInteractive.vue'
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseMutationDialog heading="Edit Example">
        <FormItemNonInteractive
            label="Id"
            description="An auto generated value that uniquely identifies this record in the database."
            :property="selectedStore.example?.id"
        />
    </BaseMutationDialog>
</template>
