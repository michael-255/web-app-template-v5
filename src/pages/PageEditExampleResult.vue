<script setup lang="ts">
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
import BaseFieldItemTextArea from '@/components/base/BaseFieldItemTextArea.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { editIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted } from 'vue'

useMeta({ title: `${appName} - Edit Example Result` })

const examplesStore = useExamplesStore()

onUnmounted(() => {
    examplesStore.selectedExampleResult = null
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="editIcon" headingTitle="Edit Example Result" />

        <q-list padding>
            <BaseFieldItemId name="Id" :value="examplesStore.selectedExampleResult?.id" />
            <BaseFieldItemTextArea name="Note" :value="examplesStore.selectedExampleResult?.note" />
        </q-list>
    </ResponsivePage>
</template>
