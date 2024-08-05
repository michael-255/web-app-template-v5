<script setup lang="ts">
import useSelectedStore from '@/stores/selected'
import { onUnmounted } from 'vue'
import BaseInspectDialog from './shared/BaseInspectDialog.vue'
import InspectItemDate from './shared/InspectItemDate.vue'
import InspectItemDefault from './shared/InspectItemDefault.vue'
import InspectItemList from './shared/InspectItemList.vue'

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})
</script>

<template>
    <BaseInspectDialog :heading="'Inspect Example Result'">
        <InspectItemDefault label="Id" :property="selectedStore.exampleResult?.id" />
        <InspectItemDate label="Created Date" :property="selectedStore.exampleResult?.createdAt" />
        <InspectItemDefault
            label="Parent Example Id"
            :property="selectedStore.exampleResult?.parentId"
        />
        <InspectItemDefault label="Note" :property="selectedStore.exampleResult?.note" />
        <InspectItemList label="Tags" :property="selectedStore.exampleResult?.tags" />
    </BaseInspectDialog>
</template>
