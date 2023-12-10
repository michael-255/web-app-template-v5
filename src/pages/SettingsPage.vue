<script setup lang="ts">
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'
import { ref } from 'vue'

useMeta({ title: `${Constant.AppName} - Settings` })

const notif1 = ref<boolean>(true)
const notif2 = ref<boolean>(false)
const notif3 = ref<boolean>(true)
const notif4 = ref<boolean>(false)

const file = ref<File | null>(null)

const model = ref<string | null>(null)
const options = ref<string[]>(['One Week', 'Three Months', 'One Year', 'Forever'])
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="col-md-8 col-sm-10 col-xs-12" style="max-width: 800px">
                <div
                    :style="{
                        position: 'sticky',
                        float: 'right',
                        right: '16px',
                        top: '75px',
                        zIndex: 1000,
                    }"
                >
                    <q-fab color="primary" :icon="Icon.down" direction="down">
                        <q-fab-action :icon="Icon.info" color="primary" />
                        <q-fab-action :icon="Icon.donate" color="pink" />
                    </q-fab>
                </div>

                <div class="text-h4 q-ma-md">
                    <q-icon class="on-left q-pb-xs" :name="Icon.settings" />
                    Settings
                </div>

                <q-separator inset class="q-my-lg" />

                <q-list>
                    <q-item-label header>
                        <q-icon class="on-left" size="sm" :name="Icon.options" />
                        Options
                    </q-item-label>

                    <q-item>
                        <q-item-section side>
                            <q-btn color="primary" label="Reset Settings" />
                        </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple class="q-mb-sm">
                        <q-item-section>
                            <q-item-label>Show Instructions Overlay</q-item-label>
                            <q-item-label caption>
                                Provides helpful information on basic app usage on startup.
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-toggle v-model="notif1" val="a" size="lg" />
                        </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple class="q-mb-sm">
                        <q-item-section>
                            <q-item-label>Advanced Mode</q-item-label>
                            <q-item-label caption>
                                Hides and simplifies parts of the app for more advanced users.
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-toggle v-model="notif2" val="b" size="lg" />
                        </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple class="q-mb-sm">
                        <q-item-section>
                            <q-item-label>Show Info Messages</q-item-label>
                            <q-item-label caption>
                                Show confirmation popup messages for actions were completed.
                            </q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-toggle v-model="notif3" val="c" size="lg" />
                        </q-item-section>
                    </q-item>

                    <q-item tag="label" v-ripple class="q-mb-sm">
                        <q-item-section>
                            <q-item-label>Show Console Logs</q-item-label>
                            <q-item-label caption>Show all log messages in the browser console.</q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-toggle v-model="notif4" val="d" size="lg" />
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Log Retention</q-item-label>
                            <q-item-label caption>Duration that logs remain stored until being removed.</q-item-label>
                        </q-item-section>
                        <q-item-section side top>
                            <q-select
                                dense
                                outlined
                                v-model="model"
                                :options="options"
                                label="Duration"
                                style="width: 150px"
                            />
                        </q-item-section>
                    </q-item>
                </q-list>

                <q-separator inset class="q-my-lg" />

                <q-list>
                    <q-item-label header>
                        <q-icon class="on-left" size="sm" :name="Icon.database" />
                        Data Management
                    </q-item-label>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Import</q-item-label>
                            <q-item-label caption>
                                Import data into the app from a JSON file. The app expects the data in the file to be
                                structured the same as the exported version. Logs are ignored during imports.
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-file v-model="file" dense outlined counter>
                                <template v-slot:before>
                                    <q-btn :icon="Icon.importFile" color="primary" />
                                </template>
                            </q-file>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Export</q-item-label>
                            <q-item-label caption>
                                Export your data as a JSON file. Do this on a regularly basis so you have a backup of
                                your data.
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-btn :icon="Icon.exportFile" color="primary" />
                    </q-item>
                </q-list>

                <q-separator inset class="q-my-lg" />

                <q-list>
                    <q-item-label header class="text-negative">
                        <q-icon class="on-left" size="sm" :name="Icon.warn" />
                        Danger Zone
                    </q-item-label>

                    <q-item>
                        <q-item-section>
                            <q-item-label caption>
                                The following operations cannot be undone. Consider exporting your data before
                                proceeding.
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Delete Logs</q-item-label>
                            <q-item-label caption> Delete all logging data from the app. </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="q-mb-sm">
                        <q-btn :icon="Icon.delete1" color="negative" />
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Delete All Data</q-item-label>
                            <q-item-label caption>
                                Permanently delete all configuration and user data from the app.
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item class="q-mb-sm">
                        <q-btn :icon="Icon.delete2" color="negative" />
                    </q-item>

                    <q-item>
                        <q-item-section>
                            <q-item-label>Delete Database</q-item-label>
                            <q-item-label caption>
                                Delete the underlining browser database and all of its data (requires app reload).
                            </q-item-label>
                        </q-item-section>
                    </q-item>

                    <q-item>
                        <q-btn :icon="Icon.delete3" color="negative" />
                    </q-item>
                </q-list>
            </div>
        </div>
    </q-page>
</template>
