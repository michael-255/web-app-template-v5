<script setup lang="ts">
import BaseFieldItemId from '@/components/base/BaseFieldItemId.vue'
import BaseFieldItemName from '@/components/base/BaseFieldItemName.vue'
import BaseFieldItemTextArea from '@/components/base/BaseFieldItemTextArea.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { editIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { onUnmounted } from 'vue'

useMeta({ title: `${appName} - Edit Example` })

const examplesStore = useExamplesStore()

onUnmounted(() => {
    examplesStore.selectedExample = null
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="editIcon" headingTitle="Edit Example" />

        <q-list padding>
            <BaseFieldItemId
                name="Id"
                description="Uniquely identifies the Example. This is auto generated for you."
                :value="examplesStore.selectedExample?.id"
            />
            <BaseFieldItemName
                description="Customizable text name for the Example."
                :value="examplesStore.selectedExample?.name"
            />
            <BaseFieldItemTextArea
                name="Description"
                description="Customizable text description that explains the Example."
                :value="examplesStore.selectedExample?.desc"
            />
        </q-list>
    </ResponsivePage>
</template>
