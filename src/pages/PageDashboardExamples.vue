<script setup lang="ts">
import BaseCardDashboard from '@/components/base/BaseCardDashboard.vue'
import BaseCardDashboardEmpty from '@/components/base/BaseCardDashboardEmpty.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import type Example from '@/models/Example'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import {
    addIcon,
    childTableIcon,
    deleteIcon,
    examplesPageIcon,
    parentTableIcon,
} from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Examples` })

const { log } = useLogger()
const router = useRouter()
const examplesStore = useExamplesStore()
const { dialogInspect, dialogConfirmStrict } = useDialogs()

async function onCharts(parentModel: Example) {
    log.info('onCharts not implemented', parentModel)
}

async function onInspect(parentModel: Example) {
    dialogInspect(parentModel)
}

async function onEdit(parentModel: Example) {
    examplesStore.selectedExample = parentModel
    router.push({ name: RouteNameEnum.EDIT_EXAMPLE })
}

async function onDelete(parentModel: Example) {
    dialogConfirmStrict(
        'Delete Example',
        `Delete ${parentModel.name} record?`,
        'negative',
        deleteIcon,
        'YES',
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
                :to="{ name: RouteNameEnum.EXAMPLES_TABLE }"
            />
            <q-fab-action
                glossy
                :icon="childTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                :to="{ name: RouteNameEnum.EXAMPLE_RESULTS_TABLE }"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
                :to="{ name: RouteNameEnum.CREATE_EXAMPLE }"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list v-if="examplesStore.examples && examplesStore.examples.length > 0" padding>
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

        <q-list v-else padding>
            <q-item>
                <q-item-section>
                    <BaseCardDashboardEmpty
                        title="No Examples Found"
                        :messages="[
                            'No Examples were found in the Database, so you need to make your own.',
                            'Click the action below to get started.',
                            '(TODO - WIP)',
                        ]"
                        :hasEmptyAction="true"
                        @onEmptyAction="log.info('Empty Action Clicked')"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
