<script setup lang="ts">
import BaseMutationForm from '@/components/forms/BaseMutationForm.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import { appName } from '@/shared/constants'
import { DBTableEnum } from '@/shared/enums'
import { createIcon } from '@/shared/icons'
import { getTableLabel } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { useMeta } from 'quasar'
import { onMounted } from 'vue'

useMeta({ title: `${appName} - Create` })

const { routeTable } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()

onMounted(async () => {
    // TODO: Handle a parentId that has no record (do parentId stuff here?)

    if (routeTable === DBTableEnum.EXAMPLES) {
        selectedStore.record = new Example()
    } else if (routeTable === DBTableEnum.EXAMPLE_RESULTS) {
        selectedStore.record = new ExampleResult()
    } else {
        log.error('Create not supported on type', { routeTable })
    }
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading
            :headingIcon="createIcon"
            :headingTitle="`Create ${getTableLabel(routeTable)}`"
        />
        <BaseMutationForm :table="routeTable" />
    </ResponsivePage>
</template>
