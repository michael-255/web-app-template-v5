<script setup lang="ts">
import PageTable from '@/components/tables/PageTable.vue'
import DB from '@/services/db'
import SettingsService from '@/services/SettingsService'
import { settingsTableIcon } from '@/shared/icons'
import { tableColumn } from '@/shared/utils'

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
    />
</template>
