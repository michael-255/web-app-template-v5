<script setup lang="ts">
import useDatabaseExampleResults from '@/composables/useDatabaseExampleResults'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DB from '@/services/db'
import {
    addIcon,
    chartsIcon,
    closeIcon,
    databaseIcon,
    deleteIcon,
    editIcon,
    filterIcon,
    inspectIcon,
    searchIcon,
} from '@/shared/icons'
import type { ExampleResultType } from '@/shared/types'
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
const databaseExampleResults = useDatabaseExampleResults(DB)

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
    tableColumn('note', 'Note', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
]

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))
const liveExampleResults: Ref<ExampleResultType[]> = ref([])

const subscription = databaseExampleResults.liveObservable().subscribe({
    next: (exampleResults) => (liveExampleResults.value = exampleResults),
    error: (error) => log.error('Error loading live Example Results', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <q-table
        fullscreen
        :rows="liveExampleResults"
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
                        @click="onChartsDialog(props.cols[0].value)"
                    />
                    <q-btn
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="inspectIcon"
                        @click="onInspectDialog(props.cols[0].value)"
                    />
                    <q-btn
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="editIcon"
                        @click="onEditDialog(props.cols[0].value)"
                    />
                    <q-btn
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
                    <q-icon class="q-pb-xs q-mr-xs" :name="databaseIcon" />
                    {{ databaseExampleResults.labelPlural }}
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
                    :disable="!liveExampleResults.length"
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
                            :disable="!liveExampleResults.length"
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
            {{
                recordsCount(
                    liveExampleResults,
                    databaseExampleResults.labelSingular,
                    databaseExampleResults.labelPlural,
                )
            }}
        </template>
    </q-table>
</template>
