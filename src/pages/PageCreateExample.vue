<script setup lang="ts">
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
import BaseFieldItemName from '@/components/base/BaseFieldItemName.vue'
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
            <BaseFieldItemId
                name="Id"
                description="Uniquely identifies the Example. This is auto generated for you."
                :value="examplesStore.selectedExample?.id"
            />
            <BaseFieldItemName
                description="Customizable readable text name for the Example."
                :value="examplesStore.selectedExample?.name"
            />
        </q-list>
    </ResponsivePage>
</template>
