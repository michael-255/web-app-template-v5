<script setup lang="ts">
import useExamples from '@/composables/useExamples'
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
import type { ExampleType } from '@/shared/types'
import {
    columnOptionsFromTableColumns,
    hiddenTableColumn,
    recordsCount,
    tableColumn,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

const { log } = useLogger(DB)
const { goBack } = useRouting(DB)
const Examples = useExamples(DB)

const tableColumns = [
    hiddenTableColumn('id'),
    tableColumn('id', 'Id', 'UUID'),
    tableColumn('createdAt', 'Created Date', 'DATE'),
    tableColumn('name', 'Name', 'TEXT'),
    tableColumn('desc', 'Description', 'TEXT'),
    tableColumn('tags', 'Tags', 'LIST-PRINT'),
    tableColumn('lastChild', 'Last Example Result', 'JSON'),
]

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(tableColumns))
const liveExamples: Ref<ExampleType[]> = ref([])

const subscription = Examples.liveObservable().subscribe({
    next: (examples) => (liveExamples.value = examples),
    error: (error) => log.error('Error loading live Examples', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <q-table
        fullscreen
        :rows="liveExamples"
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
                    {{ Examples.labelPlural }}
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
                    :disable="!liveExamples.length"
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
                            :disable="!liveExamples.length"
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
            {{ recordsCount(liveExamples, Examples.labelSingular, Examples.labelPlural) }}
        </template>
    </q-table>
</template>
