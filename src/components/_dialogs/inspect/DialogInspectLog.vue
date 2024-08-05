<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'
import BaseInspectDialog from './shared/BaseInspectDialog.vue'
import InspectItemDate from './shared/InspectItemDate.vue'
import InspectItemDefault from './shared/InspectItemDefault.vue'
import InspectItemObject from './shared/InspectItemObject.vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseInspectDialog :heading="'Inspect Log'">
        <InspectItemDefault label="Auto Id" :property="selectedStore.log?.autoId" />
        <InspectItemDate label="Created Date" :property="selectedStore.log?.createdAt" />
        <InspectItemDefault label="Log Level" :property="selectedStore.log?.logLevel" />
        <InspectItemDefault label="Label" :property="selectedStore.log?.label" />
        <InspectItemObject label="Data" :property="selectedStore.log?.details" />
    </BaseInspectDialog>
</template>
