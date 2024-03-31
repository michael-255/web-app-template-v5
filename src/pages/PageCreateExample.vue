<script setup lang="ts">
import BaseFieldItemCreatedAt from '@/components/base/BaseFieldItemCreatedAt.vue'
import BaseFieldItemDescription from '@/components/base/BaseFieldItemDescription.vue'
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
import BaseFieldItemName from '@/components/base/BaseFieldItemName.vue'
import BaseFieldItemParentTags from '@/components/base/BaseFieldItemParentTags.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { createIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted } from 'vue'

useMeta({ title: `${appName} - Create Example` })

const examplesStore = useExamplesStore()

onUnmounted(() => {
    examplesStore.selectedExample = null
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="createIcon" headingTitle="Create Example" />

        <q-list padding>
            <BaseFieldItemId :value="examplesStore.selectedExample?.id" />
            <BaseFieldItemCreatedAt :value="examplesStore.selectedExample?.createdAt" />
            <BaseFieldItemName :value="examplesStore.selectedExample?.name" />
            <BaseFieldItemDescription :value="examplesStore.selectedExample?.desc" />
            <BaseFieldItemParentTags :value="examplesStore.selectedExample?.tags" />
        </q-list>
    </ResponsivePage>
</template>
