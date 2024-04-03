<script setup lang="ts">
import BaseCardDashboard from '@/components/base/BaseCardDashboard.vue'
import BaseCardDashboardEmpty from '@/components/base/BaseCardDashboardEmpty.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useActions from '@/composables/useActions'
import useLogger from '@/composables/useLogger'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { addIcon, childTableIcon, examplesPageIcon, parentTableIcon } from '@/shared/icons'
import useliveStore from '@/stores/live'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples` })

const { log } = useLogger()
const liveStore = useliveStore()
const { onCreateExample, onInspectExample, onEditExample, onDeleteExample } = useActions()
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
                @click="onCreateExample()"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list v-if="liveStore.examples && liveStore.examples.length > 0" padding>
            <q-item v-for="example in liveStore.examples" :key="example.id">
                <q-item-section>
                    <BaseCardDashboard
                        :parentModel="example"
                        :hasCharts="true"
                        :hasInspect="true"
                        :hasEdit="true"
                        :hasDelete="true"
                        @onCharts="log.debug('Not Implemented', example)"
                        @onInspect="onInspectExample(example.id)"
                        @onEdit="onEditExample(example.id)"
                        @onDelete="onDeleteExample(example.id)"
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
