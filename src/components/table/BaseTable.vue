<script setup lang="ts">
import useRouting from '@/composables/useRouting'
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
import {
    columnOptionsFromTableColumns,
    recordCountDisplay,
    visibleColumnsFromTableColumns,
} from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { ref, type Ref } from 'vue'

const props = defineProps<{
    title: string
    icon: string
    rowKey: 'id' | 'key' | 'autoId'
    liveRows: Record<string, any>[]
    tableColumns: QTableColumn[]
    hasColumnFilters: boolean
    hasCreate: boolean
    hasCharts: boolean
    hasInspect: boolean
    hasEdit: boolean
    hasDelete: boolean
}>()

/**
 * Emitted events will return row prop containing the `id`, `key`, or `autoId` of row as a string.
 */
const emits = defineEmits(['onCreate', 'onCharts', 'onInspect', 'onEdit', 'onDelete'])

const { goBack } = useRouting()

const searchFilter: Ref<string> = ref('')
const columnOptions: Ref<QTableColumn[]> = ref(columnOptionsFromTableColumns(props.tableColumns))
const visibleColumns: Ref<string[]> = ref(visibleColumnsFromTableColumns(props.tableColumns))
</script>

<template>
    <q-table
        :rows="liveRows"
        :columns="tableColumns"
        :visible-columns="visibleColumns"
        :rows-per-page-options="[0]"
        :filter="searchFilter"
        virtual-scroll
        fullscreen
        :row-key="rowKey"
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
                        v-if="hasCharts"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="chartsIcon"
                        @click="emits('onCharts', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="hasInspect"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="inspectIcon"
                        @click="emits('onInspect', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="hasEdit"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="editIcon"
                        @click="emits('onEdit', props.cols[0].value)"
                    />
                    <q-btn
                        v-if="hasDelete"
                        flat
                        round
                        dense
                        class="q-ml-xs"
                        color="grey"
                        :icon="deleteIcon"
                        @click="emits('onDelete', props.cols[0].value)"
                    />
                </q-td>
            </q-tr>
        </template>

        <template v-slot:top>
            <div class="row justify-start full-width q-mb-md">
                <div class="col-10 text-h6 text-bold ellipsis">
                    <q-icon class="q-pb-xs q-mr-xs" :name="icon" />
                    {{ title }}
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
                            v-if="hasColumnFilters"
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
                            v-if="hasCreate"
                            color="positive"
                            class="q-px-sm q-ml-xs"
                            :icon="addIcon"
                            @click="emits('onCreate')"
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
