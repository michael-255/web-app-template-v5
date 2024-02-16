<script setup lang="ts">
import type ExampleResult from '@/models/ExampleResult'
import { closeIcon, inspectIcon } from '@/shared/icons'
import { compactDateFromMs } from '@/shared/utils'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    exampleResult: ExampleResult
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
            <q-toolbar-title>Inspect Log</q-toolbar-title>
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
                                    <q-item-label v-if="exampleResult?.id" caption>
                                        {{ exampleResult.id }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Created Date</q-item-label>
                                    <q-item-label v-if="exampleResult?.createdAt" caption>
                                        {{ compactDateFromMs(exampleResult.createdAt) }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Config Id</q-item-label>
                                    <q-item-label v-if="exampleResult?.configId" caption>
                                        {{ exampleResult.configId }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Notes</q-item-label>
                                    <q-item-label v-if="exampleResult?.notes" caption>
                                        {{ exampleResult.notes }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Activated</q-item-label>
                                    <q-item-label v-if="exampleResult?.activated" caption>
                                        Yes
                                    </q-item-label>
                                    <q-item-label v-else caption>No</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>skipped</q-item-label>
                                    <q-item-label v-if="exampleResult?.skipped" caption>
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
