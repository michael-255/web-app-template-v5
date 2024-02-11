<script setup lang="ts">
import { useDialogs, useLogger, useRouting } from '@/composables'
import { Log } from '@/models/Log'
import DB from '@/services/Database'
import { Constant, Icon } from '@/shared'
import {
    columnOptionsFromTableColumns,
    hiddenTableColumn,
    recordCountDisplay,
    tableColumn,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${Constant.AppName} - Logs Data Table` })

const { log } = useLogger()
const { goBack } = useRouting()
const { logInspectDialog } = useDialogs()

const searchFilter: Ref<string> = ref('')
const rows: Ref<Log[]> = ref([])
const columns: Ref<QTableColumn[]> = ref([
    hiddenTableColumn('autoId'),
    tableColumn('autoId', 'Auto ID'),
    tableColumn('createdAt', 'Created Date', 'date'),
    tableColumn('logLevel', 'Log Level'),
    tableColumn('label', 'Label', 'text'),
    tableColumn('details', 'Details', 'json'),
    tableColumn('errorMessage', 'Error Message', 'text'),
    tableColumn('stackTrace', 'Stack Trace', 'text'),
])
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(columns.value))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(columns.value))

const subscription = DB.liveLogs().subscribe({
    next: (records) => (rows.value = records),
    error: (error) => log.error('Error fetching live Logs', error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

async function onInspect(autoId: number) {
    const logRecord = await DB.getLog(autoId)
    if (logRecord) {
        logInspectDialog(logRecord)
    } else {
        log.error('Log not found', { autoId })
    }
}
</script>

<template>
    <q-table
        :rows="rows"
        :columns="columns"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
        :filter="searchFilter"
        virtual-scroll
        fullscreen
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
                        color="primary"
                        :icon="Icon.inspect"
                        @click="onInspect(props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">Logs</div>

                <q-btn
                    round
                    flat
                    class="absolute-top-right q-mr-sm q-mt-sm"
                    :icon="Icon.close"
                    @click="goBack()"
                />
            </div>

            <div class="row justify-start full-width">
                <div class="col-12">
                    <q-input
                        :disable="!rows.length"
                        outlined
                        dense
                        clearable
                        debounce="300"
                        v-model="searchFilter"
                        placeholder="Search"
                    >
                        <template v-slot:before>
                            <q-select
                                v-model="visibleColumns"
                                :options="columnOptions"
                                :disable="!rows.length"
                                bg-color="primary"
                                standout
                                multiple
                                dense
                                options-dense
                                emit-value
                                map-options
                                option-value="name"
                                display-value=""
                            >
                                <template v-slot:prepend>
                                    <q-icon color="white" :name="Icon.options" />
                                </template>
                            </q-select>
                        </template>

                        <template v-slot:append>
                            <q-icon :name="Icon.search" />
                        </template>
                    </q-input>
                </div>
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordCountDisplay(rows) }}
        </template>
    </q-table>
</template>
