<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import useSettings from '@/composables/useSettings'
import DB from '@/services/db'
import { closeIcon, settingsTableIcon } from '@/shared/icons'
import type { SettingType } from '@/shared/types'
import { recordsCount, tableColumn, visibleColumnsFromTableColumns } from '@/shared/utils'
import { onUnmounted, ref, type Ref } from 'vue'

const { log } = useLogger(DB)
const { goBack } = useRouting(DB)
const Settings = useSettings(DB)

const tableColumns = [tableColumn('key', 'Key'), tableColumn('value', 'Value')]

const searchFilter: Ref<string> = ref('')
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))
const liveSettings: Ref<SettingType[]> = ref([])

const subscription = Settings.liveObservable().subscribe({
    next: (settings) => (liveSettings.value = settings),
    error: (error) => log.error('Error loading live Settings', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <q-table
        fullscreen
        :rows="liveSettings"
        :columns="tableColumns"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
        :filter="searchFilter"
        virtual-scroll
        row-key="id"
    >
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th
                    v-for="col in props.cols"
                    v-show="col.name !== 'hidden'"
                    :key="col.name"
                    :props="props"
                >
                    {{ col.label }}
                </q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="settingsTableIcon" />
                    {{ Settings.labelPlural }}
                </div>

                <q-btn
                    round
                    flat
                    class="absolute-top-right q-mr-sm q-mt-sm"
                    :icon="closeIcon"
                    @click="goBack()"
                />
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordsCount(liveSettings, Settings.labelSingular, Settings.labelPlural) }}
        </template>
    </q-table>
</template>
