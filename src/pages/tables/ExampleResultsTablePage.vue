<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { closeIcon, filterIcon, inspectIcon, resultsTableIcon, searchIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
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

useMeta({ title: `${appName} - Example Results Data Table` })

const { log } = useLogger()
const { goBack } = useRouting()
const { exampleResultInspectDialog } = useDialogs()

const searchFilter: Ref<string> = ref('')
const rows: Ref<ExampleResult[]> = ref([])
const columns: Ref<QTableColumn[]> = ref([
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'uuid'),
    tableColumn('createdAt', 'Created Date', 'date'),
    tableColumn('configId', 'Config Id', 'uuid'),
    tableColumn('notes', 'Notes', 'text'),
])
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(columns.value))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(columns.value))

const subscription = DB.liveExampleResults().subscribe({
    next: (records) => (rows.value = records),
    error: (error) => log.error('Error fetching live Example Results', error as Error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})

async function onInspect(id: UUIDType) {
    const model = await DB.getExampleResult(id)
    if (model) {
        exampleResultInspectDialog(model)
    } else {
        log.error('Example Result not found', { id })
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
                        color="grey"
                        :icon="inspectIcon"
                        @click="onInspect(props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="resultsTableIcon" />
                    Example Results
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
                    :disable="!rows.length"
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
                            :disable="!rows.length"
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
            {{ recordCountDisplay(rows) }}
        </template>
    </q-table>
</template>
