<script setup lang="ts">
import type ExampleConfig from '@/models/ExampleConfig'
import { closeIcon, inspectIcon } from '@/shared/icons'
import { compactDateFromMs } from '@/shared/utils'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    exampleConfig: ExampleConfig
}>()

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white" style="max-height: 50px">
            <q-icon :name="inspectIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect Example Config</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Id</q-item-label>
                                    <q-item-label v-if="exampleConfig?.id" caption>
                                        {{ exampleConfig.id }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Created Date</q-item-label>
                                    <q-item-label v-if="exampleConfig?.createdAt" caption>
                                        {{ compactDateFromMs(exampleConfig.createdAt) }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Name</q-item-label>
                                    <q-item-label v-if="exampleConfig?.name" caption>
                                        {{ exampleConfig.name }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Description</q-item-label>
                                    <q-item-label v-if="exampleConfig?.desc" caption>
                                        {{ exampleConfig.desc }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Tags</q-item-label>
                                    <q-item-label
                                        v-if="exampleConfig?.tags && exampleConfig.tags.length > 0"
                                        caption
                                    >
                                        <ul class="q-pl-sm q-mt-none">
                                            <li
                                                v-for="element in exampleConfig.tags"
                                                :key="element"
                                                class="q-ml-sm"
                                            >
                                                {{ element }}
                                            </li>
                                        </ul>
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Activated</q-item-label>
                                    <q-item-label v-if="exampleConfig?.activated" caption>
                                        Yes
                                    </q-item-label>
                                    <q-item-label v-else caption>No</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Favorited</q-item-label>
                                    <q-item-label v-if="exampleConfig?.favorited" caption>
                                        Yes
                                    </q-item-label>
                                    <q-item-label v-else caption>No</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Enabled</q-item-label>
                                    <q-item-label v-if="exampleConfig?.enabled" caption>
                                        Yes
                                    </q-item-label>
                                    <q-item-label v-else caption>No</q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
