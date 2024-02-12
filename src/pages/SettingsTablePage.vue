<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import Setting from '@/models/Setting'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { closeIcon, searchIcon } from '@/shared/icons'
import { recordCountDisplay, tableColumn } from '@/shared/utils'
import type { QTableColumn } from 'quasar'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Settings Data Table` })

const { log } = useLogger()
const { goBack } = useRouting()

const searchFilter: Ref<string> = ref('')
const rows: Ref<Setting[]> = ref([])
const columns: Ref<QTableColumn[]> = ref([tableColumn('key', 'Key'), tableColumn('value', 'Value')])

const subscription = DB.liveSettings().subscribe({
    next: (records) => (rows.value = records),
    error: (error) => log.error('Error fetching live Settings', error),
})

onUnmounted(() => {
    subscription?.unsubscribe()
})
</script>

<template>
    <q-table
        :rows="rows"
        :columns="columns"
        :rows-per-page-options="[0]"
        :filter="searchFilter"
        virtual-scroll
        fullscreen
        row-key="id"
    >
        <template v-slot:header="props">
            <q-tr :props="props">
                <q-th v-for="col in props.cols" :key="col.name" :props="props">
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
                <div class="col-10 text-h6 text-bold ellipsis">Settings</div>

                <q-btn
                    round
                    flat
                    class="absolute-top-right q-mr-sm q-mt-sm"
                    :icon="closeIcon"
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
                        <template v-slot:append>
                            <q-icon :name="searchIcon" />
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
