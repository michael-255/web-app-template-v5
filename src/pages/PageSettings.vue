<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { DurationEnum, LimitEnum, SettingKeyEnum } from '@/shared/enums'
import {
    createIcon,
    databaseIcon,
    deleteIcon,
    deleteSweepIcon,
    deleteXIcon,
    donatePageIcon,
    examplesPageIcon,
    exportFileIcon,
    importFileIcon,
    infoIcon,
    logsTableIcon,
    optionsIcon,
    settingsPageIcon,
    settingsTableIcon,
    warnIcon,
} from '@/shared/icons'
import { type BackupDataType } from '@/shared/types'
import useSettingsStore from '@/stores/settings'
import { exportFile, uid, useMeta, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Settings` })

const settingsStore = useSettingsStore()
const notify = useQuasar().notify
const { dialogConfirm } = useDialogs()
const { log } = useLogger()

const importFile: Ref<any> = ref(null)

const logDurations = [
    DurationEnum['One Week'],
    DurationEnum['One Month'],
    DurationEnum['Three Months'],
    DurationEnum['Six Months'],
    DurationEnum['One Year'],
    DurationEnum.Forever,
]

// Called when a file has been rejected by the input
function onRejectedFile(entries: Record<string, any>[]) {
    const fileName = entries[0]?.file?.name || undefined
    log.warn(`Cannot import ${fileName}`, entries)
}

async function onImport() {
    dialogConfirm(
        'Import',
        `Import backup data from ${importFile?.value?.name} and attempt to load records into the database from it?`,
        'info',
        importFileIcon,
        async () => {
            try {
                const backupData = JSON.parse(await importFile.value.text()) as BackupDataType

                log.silentDebug('backupData:', backupData)

                if (backupData.appName !== appName) {
                    throw new Error(`Cannot import data from the app ${backupData.appName}`)
                }

                await DB.importData(backupData)

                importFile.value = null // Clear input
                log.info('Successfully imported available data')
            } catch (error) {
                log.error('Error during import', error as Error)
            }
        },
    )
}

async function onExport() {
    const appNameSlug = appName.toLowerCase().split(' ').join('-')
    const date = new Date().toISOString().split('T')[0]
    const filename = `${appNameSlug}-${date}.json`

    dialogConfirm(
        'Export',
        `Export all app data into the backup file ${filename}?`,
        'info',
        exportFileIcon,
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
                log.error('Export failed', error as Error)
            }
        },
    )
}

function onDeleteLogs() {
    dialogConfirm(
        'Delete Logs',
        'Are you sure you want to delete all app logs?',
        'negative',
        deleteIcon,
        async () => {
            try {
                await DB.clearLogs()
                log.info('Successfully deleted logs')
            } catch (error) {
                log.error(`Error deleting Logs`, error as Error)
            }
        },
    )
}

function onDeleteAppData() {
    dialogConfirm(
        'Delete App Data',
        'Are you sure you want to delete all app data?',
        'negative',
        deleteXIcon,
        async () => {
            try {
                await DB.clearAppData()
                log.info('Successfully deleted app data')
            } catch (error) {
                log.error(`Error deleting app data`, error as Error)
            }
        },
    )
}

function onDeleteDatabase() {
    dialogConfirm(
        'Delete Database',
        'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
        'negative',
        deleteSweepIcon,
        async () => {
            try {
                await DB.deleteDatabase()
                notify({ message: 'Reload the website now', icon: warnIcon, color: 'warning' })
            } catch (error) {
                log.error(`Error deleting database`, error as Error)
            }
        },
    )
}

// TODO: Remove this function after development
function testLogging() {
    log.debug('Debug', new Error('Debug error object'))
    log.info('Info', new Error('Info error object'))
    log.warn('Warn', new Error('Warn error object'))
    log.error('Error', new Error('Error error object'))
}

// TODO: Remove this function after development
async function testCreateData() {
    await DB.addExample(new Example())
    await DB.addExampleResult(new ExampleResult({ exampleId: uid() }))
}
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="logsTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Logs"
                to="/logs-table"
            />
            <q-fab-action
                glossy
                :icon="settingsTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Settings"
                to="/settings-table"
            />
            <q-fab-action
                glossy
                :icon="infoIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="About"
                to="/about"
            />
            <q-fab-action
                glossy
                :icon="donatePageIcon"
                color="pink"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Donate"
                to="/donate"
            />
        </FabMenu>

        <PageHeading :headingIcon="settingsPageIcon" headingTitle="Settings" />

        <q-list padding>
            <q-item-label header>
                <q-icon class="on-left" size="sm" :name="optionsIcon" />
                Options
            </q-item-label>

            <q-item tag="label" v-ripple>
                <q-item-section top>
                    <q-item-label>Advanced Mode</q-item-label>
                    <q-item-label caption>
                        Hides and simplifies portions of the app for more advanced users.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getValue(SettingKeyEnum.ADVANCED_MODE)"
                        @update:model-value="DB.setSetting(SettingKeyEnum.ADVANCED_MODE, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section top>
                    <q-item-label>Show Instructions Overlay</q-item-label>
                    <q-item-label caption>
                        Provides helpful information on app usage on startup.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getValue(SettingKeyEnum.INSTRUCTIONS_OVERLAY)"
                        @update:model-value="
                            DB.setSetting(SettingKeyEnum.INSTRUCTIONS_OVERLAY, $event)
                        "
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section top>
                    <q-item-label>Show Info Messages</q-item-label>
                    <q-item-label caption>
                        Show confirmation popup messages for actions that were completed.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getValue(SettingKeyEnum.INFO_MESSAGES)"
                        @update:model-value="DB.setSetting(SettingKeyEnum.INFO_MESSAGES, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item tag="label" v-ripple>
                <q-item-section top>
                    <q-item-label>Show Console Logs</q-item-label>
                    <q-item-label caption>
                        Show all log messages in the browser console.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="settingsStore.getValue(SettingKeyEnum.CONSOLE_LOGS)"
                        @update:model-value="DB.setSetting(SettingKeyEnum.CONSOLE_LOGS, $event)"
                        size="lg"
                    />
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Log Retention</q-item-label>
                    <q-item-label caption>
                        Duration that logs remain stored until being removed automatically.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-select
                        :model-value="settingsStore.getValue(SettingKeyEnum.LOG_RETENTION_DURATION)"
                        @update:model-value="
                            DB.setSetting(SettingKeyEnum.LOG_RETENTION_DURATION, $event)
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
                <q-icon class="on-left" size="sm" :name="databaseIcon" />
                Data Management
            </q-item-label>

            <q-item>
                <q-item-section top>
                    <q-item-label>Import</q-item-label>
                    <q-item-label caption>
                        Import data into the app from a JSON file. The app expects the data in the
                        file to be structured the same as the exported version. Logs are ignored
                        during imports.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-item-section top>
                    <q-file
                        v-model="importFile"
                        clearable
                        dense
                        outlined
                        accept="application/json"
                        :max-file-size="LimitEnum.MAX_FILE_SIZE"
                        @rejected="onRejectedFile($event)"
                    >
                        <template v-slot:before>
                            <q-btn
                                :disable="!importFile"
                                :icon="importFileIcon"
                                color="primary"
                                @click="onImport()"
                            />
                        </template>
                    </q-file>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Export</q-item-label>
                    <q-item-label caption>
                        Export your data as a JSON file. Do this on a regularly basis so you have a
                        backup of your data.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn :icon="exportFileIcon" color="primary" @click="onExport()" />
            </q-item>

            <q-separator class="q-my-md" />

            <q-item-label header class="text-negative">
                <q-icon class="on-left" size="sm" :name="warnIcon" />
                Danger Zone
            </q-item-label>

            <q-item-label header>
                The following operations cannot be undone. Consider exporting your data before
                proceeding.
            </q-item-label>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete Logs</q-item-label>
                    <q-item-label caption> Delete all logging data from the app. </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-btn :icon="deleteIcon" color="negative" @click="onDeleteLogs()" />
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete App Data</q-item-label>
                    <q-item-label caption>
                        Permanently delete all configuration and user data from the app.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item class="q-mb-sm">
                <q-btn :icon="deleteXIcon" color="negative" @click="onDeleteAppData()" />
            </q-item>

            <q-item>
                <q-item-section top>
                    <q-item-label>Delete Database</q-item-label>
                    <q-item-label caption>
                        Delete the underlining browser database and all of its data (requires app
                        reload).
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-btn :icon="deleteSweepIcon" color="negative" @click="onDeleteDatabase()" />
            </q-item>

            <!-- TODO: Remove this function after development -->
            <q-item class="q-mt-xl">
                <q-btn :icon="examplesPageIcon" color="negative" @click="testLogging()" />
                <q-btn :icon="createIcon" color="negative" @click="testCreateData()" />
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.duration-width {
    width: 150px;
}
</style>
@/models/Example
