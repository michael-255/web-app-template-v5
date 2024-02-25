<script setup lang="ts">
import BaseCardDashboard from '@/components/base/BaseCardDashboard.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import type Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import {
    addIcon,
    childTableIcon,
    deleteIcon,
    examplesPageIcon,
    parentTableIcon,
} from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples` })

const examplesStore = useExamplesStore()
const { log } = useLogger()
const { dialogInspect, dialogConfirmStrict } = useDialogs()

async function onCharts(parentModel: Example) {
    // TODO
    log.info('onCharts not implemented', parentModel)
}

async function onInspect(parentModel: Example) {
    dialogInspect(parentModel)
}

async function onEdit(parentModel: Example) {
    // TODO
    log.info('onEdit not implemented', parentModel)
}

async function onDelete(parentModel: Example) {
    dialogConfirmStrict(
        'Delete Example',
        `Delete ${parentModel.name} record?`,
        'negative',
        deleteIcon,
        'DELETE',
        async () => {
            try {
                await DB.deleteExample(parentModel.id)
                log.info(`Deleted Example`, parentModel)
            } catch (error) {
                log.error(`Error deleting Example`, error as Error)
            }
        },
    )
}
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="parentTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Examples"
                to="/examples-table"
            />
            <q-fab-action
                glossy
                :icon="childTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                to="/example-results-table"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
                to="/create-example"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <q-item v-for="example in examplesStore.examples" :key="example.id">
                <q-item-section>
                    <BaseCardDashboard
                        :parentModel="example"
                        :hasCharts="true"
                        :hasInspect="true"
                        :hasEdit="true"
                        :hasDelete="true"
                        @onCharts="onCharts"
                        @onInspect="onInspect"
                        @onEdit="onEdit"
                        @onDelete="onDelete"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
