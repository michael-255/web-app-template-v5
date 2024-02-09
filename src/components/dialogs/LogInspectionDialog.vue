<script setup lang="ts">
import { Log } from '@/models'
import { CommonUtil, Icon } from '@/shared'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    log: Log
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
            <q-icon :name="Icon.inspect" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect Log</q-toolbar-title>
            <q-btn flat round :icon="Icon.close" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Auto Id</q-item-label>
                                    <q-item-label v-if="log?.autoId" caption>
                                        {{ log.autoId }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Created Date</q-item-label>
                                    <q-item-label v-if="log?.createdAt" caption>
                                        {{ CommonUtil.getCompactDateFromMs(log.createdAt) }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Log Level</q-item-label>
                                    <q-item-label v-if="log?.logLevel" caption>
                                        {{ log.logLevel }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Label</q-item-label>
                                    <q-item-label v-if="log?.label" caption>
                                        {{ log.label }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Details</q-item-label>
                                    <q-item-label v-if="log?.details" caption>
                                        <li
                                            v-for="(value, key) in log.details"
                                            :key="key"
                                            class="q-ml-sm"
                                        >
                                            {{ key }}: {{ value }}
                                        </li>
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Error Message</q-item-label>
                                    <q-item-label v-if="log?.errorMessage" caption>
                                        {{ log.errorMessage }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
                                </q-item-section>
                            </q-item>

                            <q-item>
                                <q-item-section>
                                    <q-item-label>Stack Trace</q-item-label>
                                    <q-item-label v-if="log?.stackTrace" caption>
                                        {{ log.stackTrace }}
                                    </q-item-label>
                                    <q-item-label v-else caption>-</q-item-label>
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
