<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useLogs from '@/composables/useLogs'
import useRouting from '@/composables/useRouting'
import DB from '@/services/db'
import {
    chartsIcon,
    closeIcon,
    filterIcon,
    inspectIcon,
    logsTableIcon,
    searchIcon,
} from '@/shared/icons'
import type { LogType } from '@/shared/types'
import {
    columnOptionsFromTableColumns,
    hiddenTableColumn,
    recordsCount,
    tableColumn,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

const { log } = useLogger()
const { goBack } = useRouting()
const Logs = useLogs(DB)

const tableColumns = [
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto Id'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'TEXT'),
    tableColumn('details', 'Details', 'JSON'),
]

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))
const liveLogs: Ref<LogType[]> = ref([])

const subscription = Logs.liveObservable().subscribe({
    next: (logs) => (liveLogs.value = logs),
    error: (error) => log.error('Error loading live Logs', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <q-table
        fullscreen
        :rows="liveLogs"
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
                <q-th auto-width class="text-left">Actions</q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
                <q-td auto-width>
                    <q-btn
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="chartsIcon"
                        @click="Logs.onChartsDialog()"
                    />
                    <q-btn
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="inspectIcon"
                        @click="Logs.onInspectDialog(props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="logsTableIcon" />
                    {{ Logs.labelPlural }}
                </div>

                <q-btn
                    round
                    flat
                    class="absolute-top-right q-mr-sm q-mt-sm"
                    :icon="closeIcon"
                    @click="goBack()"
                />
            </div>

            <div class="row justify-start full-width">
                <q-input
                    :disable="!liveLogs.length"
                    outlined
                    dense
                    clearable
                    debounce="300"
                    v-model="searchFilter"
                    placeholder="Search"
                    class="full-width"
                >
                    <template v-slot:after>
                        <q-select
                            v-model="visibleColumns"
                            :options="columnOptions"
                            :disable="!liveLogs.length"
                            multiple
                            dense
                            options-dense
                            emit-value
                            map-options
                            option-value="name"
                            display-value=""
                            bg-color="primary"
                        >
                            <template v-slot:append>
                                <q-icon color="white" :name="filterIcon" />
                            </template>
                        </q-select>
                    </template>

                    <template v-slot:append>
                        <q-icon :name="searchIcon" />
                    </template>
                </q-input>
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordsCount(liveLogs, Logs.labelSingular, Logs.labelPlural) }}
        </template>
    </q-table>
</template>
