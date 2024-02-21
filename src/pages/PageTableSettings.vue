<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useLogger from '@/composables/useLogger'
import Setting from '@/models/Setting'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Settings Data Table` })

const { log } = useLogger()

const liveDataRows: Ref<Setting[]> = ref([])
const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]

const subscription = DB.liveSettings().subscribe({
    next: (records) => (liveDataRows.value = records),
    error: (error) => log.error('Error fetching live Settings', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})
</script>

<template>
    <BaseTable
        title="Settings"
        :icon="settingsTableIcon"
        rowKey="key"
        :liveDataRows="liveDataRows"
        :tableColumns="tableColumns"
        :hasColumnFilters="false"
        :hasCreate="false"
        :hasCharts="false"
        :hasInspect="false"
        :hasEdit="false"
        :hasDelete="false"
        @onCreate="log.error('Action not supported', { action: 'onCreate' })"
        @onCharts="log.error('Action not supported', { action: 'onCharts' })"
        @onInspect="log.error('Action not supported', { action: 'onInspect' })"
        @onEdit="log.error('Action not supported', { action: 'onEdit' })"
        @onDelete="log.error('Action not supported', { action: 'onDelete' })"
    />
</template>
