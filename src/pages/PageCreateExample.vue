<script setup lang="ts">
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { useMeta } from 'quasar'
import { onUnmounted } from 'vue'

useMeta({ title: `${appName} - Create Example` })

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.record = {}
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="createIcon" headingTitle="Create Example" />

        <q-list padding>
            <FieldItemId :value="selectedStore.record?.id" />
            <FieldItemName :value="selectedStore.record?.name" />
        </q-list>
    </ResponsivePage>
</template>
