<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import { appName } from '@/shared/constants'
import {
    addIcon,
    configsTableIcon,
    examplesPageIcon,
    favoriteOnIcon,
    resultsTableIcon,
    verticalDotMenuIcon,
} from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Examples` })

const { exampleConfigCreateDialog } = useDialogs()

function onCreate() {
    exampleConfigCreateDialog()
}
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="configsTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Configs Table"
                to="/example-configs-table"
            />
            <q-fab-action
                glossy
                :icon="resultsTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results Table"
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
                @click="onCreate()"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <q-item v-for="n in 100" :key="n">
                <q-item-section>
                    <q-card>
                        <q-item class="q-pt-sm">
                            <q-item-section>
                                <q-item-label class="text-weight-bold text-body1 q-mb-sm">
                                    Record Name That Can Be Up To Fifty Characters!
                                </q-item-label>
                                <q-item-label caption> Fri, 2023 Oct 20th, 4:40 PM </q-item-label>
                                <q-item-label caption> 11 days ago </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <q-btn
                                    class="vert-menu-btn-translation"
                                    flat
                                    dense
                                    round
                                    :icon="verticalDotMenuIcon"
                                />
                                <q-btn
                                    class="favorite-btn-translation"
                                    flat
                                    dense
                                    round
                                    color="amber"
                                    :icon="favoriteOnIcon"
                                />
                            </q-item-section>
                        </q-item>

                        <q-item>
                            <q-item-section>
                                <q-item-label>
                                    Card Description - Need more text here to test how it looks with
                                    more text in the card. This is a test to see how it looks with
                                    more text in the card. This is a test to see how it looks with
                                    more text in the card. This is a test to see how it looks with
                                    more text in the card.
                                </q-item-label>
                            </q-item-section>
                        </q-item>

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
.vert-menu-btn-translation {
    transform: translateY(-7px) translateX(15px);
}
.favorite-btn-translation {
    transform: translateY(-41px) translateX(-20px);
}
</style>
