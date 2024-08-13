<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import SettingsService from '@/services/SettingsService'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'

const { log } = useLogger(DB)
const settingsService = SettingsService(DB)

const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]
</script>
<template>
    <PageTable
        labelSingular="Setting"
        labelPlural="Settings"
        :icon="settingsTableIcon"
        :tableColumns="tableColumns"
        :supportsColumnFilters="false"
        :supportsActions="false"
        :supportsCharts="false"
        :supportsInspect="false"
        :supportsCreate="false"
        :supportsEdit="false"
        :supportsDelete="false"
        :dataObservable="settingsService.liveObservable()"
        :onChartsDialog="log.error('Charts not supported')"
        :onInspectDialog="log.error('Inspect not supported')"
        :onCreateDialog="log.error('Create not supported')"
        :onEditDialog="log.error('Edit not supported')"
        :onDeleteDialog="log.error('Delete not supported')"
    />
</template>
