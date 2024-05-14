<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import {
    addIcon,
    chartsIcon,
    closeIcon,
    deleteIcon,
    editIcon,
    filterIcon,
    inspectIcon,
    searchIcon,
} from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import type { QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

const { log } = useLogger()
const { routeTable, goBack } = useRouting()
const { onInspectDialog, onDeleteDialog, onCreateDialog, onEditDialog, onChartsDialog } =
    useDialogs()

const service = DatabaseManager.getService(routeTable!)
const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(service.tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(service.tableColumns))
const liveRows: Ref<ModelType[]> = ref([])

const subscription = service.liveTable(DB).subscribe({
    next: (records) => (liveRows.value = records),
    error: (error) => log.error('Error loading live data', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})

/**
 * Column options from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `QTableColumn[]`
 */
function columnOptionsFromTableColumns(tableColumns: QTableColumn[]) {
    return tableColumns.filter((col) => !col.required)
}

/**
 * Visible columns from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `string[]`
 */
function visibleColumnsFromTableColumns(tableColumns: QTableColumn[]) {
    const columnOptions = columnOptionsFromTableColumns(tableColumns).filter((col) => !col.required)
    return columnOptions.map((col) => col.name)
}

/**
 * Display string for the number of records found in an array.
 * @param records Array of any records from the DB
 * @returns `999 records found`
 */
function recordCountDisplay(records: any[]) {
    const count = records?.length ?? 0

    if (count === 0) {
        return 'No records found'
    } else if (count === 1) {
        return '1 record found'
    } else {
        return `${count} records found`
    }
}
</script>

<template>
    <q-table
        :rows="liveRows"
        :columns="service.tableColumns"
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
                <q-th v-if="service.supportsActions" auto-width class="text-left">Actions</q-th>
            </q-tr>
        </template>

        <template v-slot:body="props">
            <q-tr :props="props">
                <q-td v-for="col in props.cols" :key="col.name" :props="props">
                    {{ col.value }}
                </q-td>
                <q-td v-if="service.supportsActions" auto-width>
                    <q-btn
                        v-if="service.supportsCharts"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="chartsIcon"
                        @click="onChartsDialog(props.cols[0].value)"
                    />
                    <q-btn
                        v-if="service.supportsInspect"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="inspectIcon"
                        @click="onInspectDialog(props.cols[0].value)"
                    />
                    <q-btn
                        v-if="service.supportsEdit"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="editIcon"
                        @click="onEditDialog(props.cols[0].value)"
                    />
                    <q-btn
                        v-if="service.supportsDelete"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="deleteIcon"
                        @click="onDeleteDialog(props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="service.icon" />
                    {{ service.labelPlural }}
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
                    :disable="!liveRows.length"
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
                            v-if="service.supportsColumnFilters"
                            v-model="visibleColumns"
                            :options="columnOptions"
                            :disable="!liveRows.length"
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

                        <q-btn
                            v-if="service.supportsCreate"
                            color="positive"
                            class="q-px-sm q-ml-xs"
                            :icon="addIcon"
                            @click="onCreateDialog(service.table)"
                        />
                    </template>

                    <template v-slot:append>
                        <q-icon :name="searchIcon" />
                    </template>
                </q-input>
            </div>
        </template>

        <template v-slot:bottom>
            {{ recordCountDisplay(liveRows) }}
        </template>
    </q-table>
</template>
