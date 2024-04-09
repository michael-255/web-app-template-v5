<script setup lang="ts">
import BaseMutationForm from '@/components/forms/BaseMutationForm.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { DBTableEnum } from '@/shared/enums'
import { editIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import { getTableLabel } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { extend, useMeta } from 'quasar'
import { onMounted } from 'vue'

useMeta({ title: `${appName} - Edit` })

const { routeTable, routeId } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()

onMounted(async () => {
    // Must directly get records from the DB versus Store to avoid issues on reload
    if (routeTable === DBTableEnum.EXAMPLES) {
        const example = await DB.getExample(routeId as UUIDType)
        selectedStore.record = extend(true, {}, example) // Deep copy
    } else if (routeTable === DBTableEnum.EXAMPLE_RESULTS) {
        const exampleResult = await DB.getExampleResult(routeId as UUIDType)
        selectedStore.record = extend(true, {}, exampleResult) // Deep copy
    } else {
        log.error('Edit not supported on type', { routeTable })
    }

    if (Object.keys(selectedStore.record).length === 0) {
        log.error('Record not found', { routeTable, routeId })
    }
})
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="editIcon" :headingTitle="`Edit ${getTableLabel(routeTable)}`" />
        <BaseMutationForm :table="routeTable" />
    </ResponsivePage>
</template>
