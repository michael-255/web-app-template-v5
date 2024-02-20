<script setup lang="ts">
import BaseCardDashboard from '@/components/base/BaseCardDashboard.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { addIcon, dataTableIcon, examplesPageIcon, parentTableIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples` })

const examplesStore = useExamplesStore()
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
                :icon="dataTableIcon"
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
                    <BaseCardDashboard :parentModel="example" />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
