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
import { getTableLabel } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { extend, useMeta } from 'quasar'
import { onMounted } from 'vue'

useMeta({ title: `${appName} - Edit` })

const { routeTable, routeId } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()

onMounted(async () => {
    try {
        // Get record from DB versus Store to avoid issues on reload
        if (routeTable !== DBTableEnum.SETTINGS && routeTable !== DBTableEnum.LOGS) {
            const record = await DB.getRecord(routeTable!, routeId!) // Route params will exist
            selectedStore.record = extend(true, {}, record) // Deep copy
        } else {
            log.error('Edit not supported on table', { routeTable })
        }
    } catch (error) {
        log.error('Error loading Edit page', error as Error)
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
