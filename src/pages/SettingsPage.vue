<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { useDialogs, useLogger } from '@/composables'
import { DB } from '@/services'
import { Constant, Enum, Icon, Type } from '@/shared'
import { useSettingsStore } from '@/stores'
import { exportFile, useMeta, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'

useMeta({ title: `${Constant.AppName} - Settings` })

const settingsStore = useSettingsStore()
const notify = useQuasar().notify
const { confirmDialog } = useDialogs()
const { log } = useLogger()

const importFile: Ref<any> = ref(null)

const logDurations = [
    Enum.Duration['One Week'],
    Enum.Duration['One Month'],
    Enum.Duration['Three Months'],
    Enum.Duration['Six Months'],
    Enum.Duration['One Year'],
    Enum.Duration.Forever,
]

// Called when a file has been rejected by the input
function onRejectedFile(entries: Record<string, any>[]) {
    const fileName = entries[0]?.file?.name || undefined
    log.warn(`Cannot import ${fileName}`, entries)
}

async function onImport() {
    confirmDialog(
        'Import',
        `Import backup data from ${importFile?.value?.name} and attempt to load records into the database from it?`,
        'info',
        Icon.importFile,
        async () => {
            try {
                const backupData = JSON.parse(await importFile.value.text()) as Type.BackupData

                log.silentDebug('backupData:', backupData)

                if (backupData.appName !== Constant.AppName) {
                    throw new Error(`Cannot import data from the app ${backupData.appName}`)
                }

                await DB.importData(backupData)

                importFile.value = null // Clear input
                log.info('Successfully imported available data')
            } catch (error) {
                log.error('Error during import', error)
            }
        },
    )
}

async function onExport() {
    const appNameSlug = Constant.AppName.toLowerCase().split(' ').join('-')
    const date = new Date().toISOString().split('T')[0]
    const filename = `${appNameSlug}-${date}.json`

    confirmDialog(
        'Export',
        `Export all app data into the backup file ${filename}?`,
        'info',
        Icon.exportFile,
        async () => {
            try {
                const backupData = await DB.getBackupData()

                log.silentDebug('backupData:', backupData)

                const exported = exportFile(filename, JSON.stringify(backupData), {
                    encoding: 'UTF-8',
                    mimeType: 'application/json',
                })

                if (exported === true) {
                    log.info('Backup downloaded successfully', { filename })
                } else {
                    throw new Error('Browser denied file download')
                }
            } catch (error) {
                log.error('Export failed', error)
            }
        },
    )
}

function onDeleteLogs() {
    confirmDialog(
        'Delete Logs',
        'Are you sure you want to delete all app logs?',
        'negative',
        Icon.delete1,
        async () => {
            try {
                await DB.clearLogs()
                log.info('Successfully deleted logs')
            } catch (error) {
                log.error(`Error deleting Logs`, error)
            }
        },
    )
}

function onDeleteAppData() {
    confirmDialog(
        'Delete App Data',
        'Are you sure you want to delete all app data?',
        'negative',
        Icon.delete2,
        async () => {
            try {
                await DB.clearAppData()
                log.info('Successfully deleted app data')
            } catch (error) {
                log.error(`Error deleting app data`, error)
            }
        },
    )
}

function onDeleteDatabase() {
    confirmDialog(
        'Delete Database',
        'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
        'negative',
        Icon.delete3,
        async () => {
            try {
                await DB.deleteDatabase()
                notify({ message: 'Reload the website now', icon: Icon.warn, color: 'warning' })
            } catch (error) {
                log.error(`Error deleting database`, error)
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
                    <q-file
                        v-model="importFile"
                        clearable
                        dense
                        outlined
                        accept="application/json"
                        :max-file-size="Enum.Limit.MAX_FILE_SIZE"
                        @rejected="onRejectedFile($event)"
                    >
                        <template v-slot:before>
                            <q-btn
                                :disable="!importFile"
                                :icon="Icon.importFile"
                                color="primary"
                                @click="onImport()"
                            />
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
                <q-btn :icon="Icon.exportFile" color="primary" @click="onExport()" />
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
                <q-btn :icon="Icon.delete1" color="negative" @click="onDeleteLogs()" />
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>Delete App Data</q-item-label>
                    <q-item-label caption>
                        Permanently delete all configuration and user data from the app.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-btn :icon="Icon.delete2" color="negative" @click="onDeleteAppData()" />
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
                <q-btn :icon="Icon.delete3" color="negative" @click="onDeleteDatabase()" />
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.duration-width {
    width: 150px;
}
</style>
