<script setup lang="ts">
import BaseFieldItemCreatedAt from '@/components/base/BaseFieldItemCreatedAt.vue'
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
import BaseFieldItemNote from '@/components/base/BaseFieldItemNote.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { createIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted } from 'vue'

useMeta({ title: `${appName} - Create Example Result` })

const examplesStore = useExamplesStore()

onUnmounted(() => {
    examplesStore.selectedExampleResult = null
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="createIcon" headingTitle="Create Example Result" />

        <q-list padding>
            <BaseFieldItemId :value="examplesStore.selectedExampleResult?.id" />
            <BaseFieldItemCreatedAt :value="examplesStore.selectedExampleResult?.createdAt" />
            <BaseFieldItemNote :value="examplesStore.selectedExampleResult?.note" />
        </q-list>
    </ResponsivePage>
</template>
