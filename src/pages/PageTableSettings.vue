<script setup lang="ts">
import BaseTable from '@/components/base/BaseTable.vue'
import useLogger from '@/composables/useLogger'
import { appName } from '@/shared/constants'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'
import useLiveStore from '@/stores/live'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Settings Data Table` })

const { log } = useLogger()
const liveStore = useLiveStore()

const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
</script>

<template>
    <BaseTable
        title="Settings"
        :icon="settingsTableIcon"
        rowKey="key"
        :liveRows="liveStore.settings"
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
