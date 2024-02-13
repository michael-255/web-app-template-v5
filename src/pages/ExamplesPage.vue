<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import {
    addIcon,
    configsIcon,
    delete1Icon,
    examplesIcon,
    favoriteOnIcon,
    menu2Icon,
    resultsIcon,
} from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples` })
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="configsIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Configs"
            />
            <q-fab-action
                glossy
                :icon="resultsIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesIcon" headingTitle="Examples" />

        <q-list padding>
            <q-item v-for="n in 100" :key="n">
                <q-item-section>
                    <q-card>
                        <div class="absolute-top-right q-ma-xs">
                            <div>
                                <q-btn flat round class="q-mb-xs" :icon="menu2Icon" />
                            </div>
                            <div>
                                <q-btn
                                    flat
                                    round
                                    class="q-mb-xs"
                                    color="amber"
                                    :icon="favoriteOnIcon"
                                />
                            </div>
                            <div>
                                <q-btn flat round color="negative" :icon="delete1Icon" />
                            </div>
                        </div>

                        <q-card-section class="q-mr-xl">
                            <div class="text-weight-bold text-body1 q-mb-sm">Record Name</div>

                            <div class="caption text-grey">Fri, 2023 Oct 20th, 4:40 PM</div>

                            <div class="caption text-grey q-mb-sm">11 days ago</div>

                            <p>
                                Card Description - Need more text here to test how it looks with
                                more text in the card. This is a test to see how it looks with more
                                text in the card. This is a test to see how it looks with more text
                                in the card. This is a test to see how it looks with more text in
                                the card.
                            </p>
                        </q-card-section>

                        <q-card-actions>
                            <q-btn color="primary" label="Begin" class="full-width" />
                        </q-card-actions>
                    </q-card>
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.card-section-height {
    min-height: 150px;
}
</style>
