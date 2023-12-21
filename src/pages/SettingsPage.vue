<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { DB } from '@/services'
import { Constant, Enum, Icon } from '@/shared'
import { useSettingsStore } from '@/stores'
import { useMeta } from 'quasar'
import { ref } from 'vue'

useMeta({ title: `${Constant.AppName} - Settings` })

const settingsStore = useSettingsStore()

const file = ref<File | null>(null)

const model = ref<string | null>(null)

const logDurations = [
    Enum.Duration['One Week'],
    Enum.Duration['One Month'],
    Enum.Duration['Three Months'],
    Enum.Duration['Six Months'],
    Enum.Duration['One Year'],
    Enum.Duration.Forever,
]
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="Icon.logs"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Logs"
            />
            <q-fab-action
                glossy
                :icon="Icon.info"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="About"
            />
            <q-fab-action
                glossy
                :icon="Icon.donate"
                color="pink"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Donate"
            />
        </FabMenu>

        <PageHeading :headingIcon="Icon.settings" headingTitle="Settings" />

        <q-list padding>
            <q-item-label header>
                <q-icon class="on-left" size="sm" :name="Icon.options" />
                Options
            </q-item-label>

            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>Advanced Mode</q-item-label>
                    <q-item-label caption>
                        Hides and simplifies portions of the app for more advanced users.
                    </q-item-label>
                </q-item-section>

                <q-item-section side top>
                    <q-toggle
                        :model-value="settingsStore.getValue(Enum.SettingKey.ADVANCED_MODE)"
                        @update:model-value="DB.setSetting(Enum.SettingKey.ADVANCED_MODE, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>Show Instructions Overlay</q-item-label>
                    <q-item-label caption>
                        Provides helpful information on app usage on startup.
                    </q-item-label>
                </q-item-section>

                <q-item-section side top>
                    <q-toggle
                        :model-value="settingsStore.getValue(Enum.SettingKey.INSTRUCTIONS_OVERLAY)"
                        @update:model-value="
                            DB.setSetting(Enum.SettingKey.INSTRUCTIONS_OVERLAY, $event)
                        "
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>Show Info Messages</q-item-label>
                    <q-item-label caption>
                        Show confirmation popup messages for actions that were completed.
                    </q-item-label>
                </q-item-section>

                <q-item-section side top>
                    <q-toggle
                        :model-value="settingsStore.getValue(Enum.SettingKey.INFO_MESSAGES)"
                        @update:model-value="DB.setSetting(Enum.SettingKey.INFO_MESSAGES, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section>
                    <q-item-label>Show Console Logs</q-item-label>
                    <q-item-label caption>
                        Show all log messages in the browser console.
                    </q-item-label>
                </q-item-section>

                <q-item-section side top>
                    <q-toggle
                        :model-value="settingsStore.getValue(Enum.SettingKey.CONSOLE_LOGS)"
                        @update:model-value="DB.setSetting(Enum.SettingKey.CONSOLE_LOGS, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>Log Retention</q-item-label>
                    <q-item-label caption>
                        Duration that logs remain stored until being removed automatically.
                    </q-item-label>
                </q-item-section>

                <q-item-section side top>
                    <q-select
                        :model-value="
                            settingsStore.getValue(Enum.SettingKey.LOG_RETENTION_DURATION)
                        "
                        @update:model-value="
                            DB.setSetting(Enum.SettingKey.LOG_RETENTION_DURATION, $event)
                        "
                        :options="logDurations"
                        dense
                        outlined
                        label="Duration"
                        class="duration-width"
                    />
                </q-item-section>
            </q-item>

            <q-separator class="q-my-md" />

            <q-item-label header>
                <q-icon class="on-left" size="sm" :name="Icon.database" />
                Data Management
            </q-item-label>

            <q-item>
                <q-item-section>
                    <q-item-label>Import</q-item-label>
                    <q-item-label caption>
                        Import data into the app from a JSON file. The app expects the data in the
                        file to be structured the same as the exported version. Logs are ignored
                        during imports.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-item-section>
                    <q-file v-model="file" dense outlined>
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
                        Export your data as a JSON file. Do this on a regularly basis so you have a
                        backup of your data.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn :icon="Icon.exportFile" color="primary" />
            </q-item>

            <q-separator class="q-my-md" />

            <q-item-label header class="text-negative">
                <q-icon class="on-left" size="sm" :name="Icon.warn" />
                Danger Zone
            </q-item-label>

            <q-item-label header>
                The following operations cannot be undone. Consider exporting your data before
                proceeding.
            </q-item-label>

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
                        Delete the underlining browser database and all of its data (requires app
                        reload).
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn :icon="Icon.delete3" color="negative" />
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.duration-width {
    width: 150px;
}
</style>
