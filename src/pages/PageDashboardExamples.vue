<script setup lang="ts">
import CardDashboardEmpty from '@/components/dashboard/CardDashboardEmpty.vue'
import CardDashboardList from '@/components/dashboard/CardDashboardList.vue'
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import type Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import { addIcon, childTableIcon, examplesPageIcon, parentTableIcon } from '@/shared/icons'
import { useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Examples` })

const { log } = useLogger()
const { onInspectDialog, onDeleteRecord } = useActions()
const { goToTable, goToCreate, goToEdit } = useRouting()

const liveExamples: Ref<Example[]> = ref([])

const subscription = DB.liveDashboardTable(TableEnum.EXAMPLES).subscribe({
    next: (records) => {
        liveExamples.value = records
    },
    error: (error) => {
        log.error('Error loading live Examples', error as Error)
    },
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
                :icon="parentTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Examples"
                @click="goToTable(TableEnum.EXAMPLES)"
            />
            <q-fab-action
                glossy
                :icon="childTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                @click="goToTable(TableEnum.EXAMPLE_RESULTS)"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
                @click="goToCreate(TableEnum.EXAMPLES)"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list v-if="liveExamples && liveExamples.length > 0" padding>
            <q-item v-for="example in liveExamples" :key="example.id">
                <q-item-section>
                    <CardDashboardList
                        :parentModel="example"
                        :table="TableEnum.EXAMPLES"
                        :hasCharts="true"
                        :hasInspect="true"
                        :hasEdit="true"
                        :hasDelete="true"
                        @onCharts="log.debug('Not Implemented', example)"
                        @onInspect="onInspectDialog(example.id)"
                        @onEdit="goToEdit(example.id)"
                        @onDelete="onDeleteRecord(example.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>

        <q-list v-else padding>
            <q-item>
                <q-item-section>
                    <CardDashboardEmpty
                        title="No Examples Found"
                        :messages="[
                            'No Examples were found in the Database, so you need to make your own.',
                            'Click the button below to get started.',
                        ]"
                        :hasButton="true"
                        buttonLabel="Create Example"
                        buttonColor="positive"
                        @onButtonAction="goToCreate(TableEnum.EXAMPLES)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
