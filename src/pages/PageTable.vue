<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import type { ModelType } from '@/shared/types'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Data Table` })

const { log } = useLogger()
const { routeTable } = useRouting()

const liveRecords: Ref<ModelType[]> = ref([])

const service = DatabaseManager.getService(routeTable!)
const subscription = service.liveTable(DB).subscribe({
    next: (records) => (liveRecords.value = records),
    error: (error) => log.error('Error loading live data', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <component
        :is="service.dataTable(liveRecords).component"
        v-bind="service.dataTable(liveRecords).props"
    />
</template>
