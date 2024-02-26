<script setup lang="ts">
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
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
            <BaseFieldItemId
                name="Id"
                description="Uniquely identifies the Example Result in the database. This is auto generated for you."
                :value="examplesStore.selectedExampleResult?.id"
            />
        </q-list>
    </ResponsivePage>
</template>
