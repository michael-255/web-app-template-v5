<script setup lang="ts">
import CardDashboardList from '@/components/dashboard/CardDashboardList.vue'
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import { addIcon, databaseIcon, examplesPageIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Dashboard` })

const { log } = useLogger()
const { onDeleteDialog, onInspectDialog, onCreateDialog, onEditDialog } = useDialogs()
const { routeTable, goToTable } = useRouting()

const liveRecords: Ref<ModelType[]> = ref([])

const service = DatabaseManager.getService(routeTable!)
const subscription = service.liveDashboard(DB).subscribe({
    next: (records) => (liveRecords.value = records),
    error: (error) => log.error('Error loading live data', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <ResponsivePage>
        <DialogInstructionsOverlay />

        <FabMenu>
            <q-fab-action
                glossy
                :icon="databaseIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Examples"
                @click="goToTable(service.table)"
            />
            <q-fab-action
                glossy
                :icon="databaseIcon"
                color="warning"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                @click="goToTable(service.childTable)"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
                @click="onCreateDialog(service.table)"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <q-item v-for="record in liveRecords" :key="record.id">
                <q-item-section>
                    <CardDashboardList
                        :record="record"
                        :table="service.table"
                        :hasCharts="true"
                        :hasInspect="true"
                        :hasEdit="true"
                        :hasDelete="true"
                        @onCharts="log.debug('Not Implemented', record)"
                        @onInspect="onInspectDialog(record.id)"
                        @onEdit="onEditDialog(record.id)"
                        @onDelete="onDeleteDialog(record.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
