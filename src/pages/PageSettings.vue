<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import {
    DurationEnum,
    LimitEnum,
    RouteNameEnum,
    SettingIdEnum,
    SlugTableEnum,
    TableEnum,
} from '@/shared/enums'
import {
    createIcon,
    databaseIcon,
    deleteIcon,
    deleteSweepIcon,
    deleteXIcon,
    donatePageIcon,
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
import { exportFile, useMeta, useQuasar } from 'quasar'
import { ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Settings` })

const $q = useQuasar()
const notify = useQuasar().notify
const settingsStore = useSettingsStore()
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

/**
 * Handles rejected files during import and logs a warning.
 */
function onRejectedFile(entries: any) {
    const name = entries?.[0]?.file?.name
    const size = entries?.[0]?.file?.size
    const type = entries?.[0]?.file?.type
    log.warn(`Cannot import ${name}`, { name, size, type })
    importFile.value = null // Clear input
}

/**
 * Imports all data from a JSON file into the app.
 * Settings Page only.
 */
function onImport() {
    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Import',
            message: `Import backup data from ${importFile?.value?.name} and attempt to load records into the database from it?`,
            color: 'info',
            icon: importFileIcon,
        },
    }).onOk(async () => {
        try {
            const backupData = JSON.parse(await importFile.value.text()) as BackupDataType
            log.silentDebug('backupData:', backupData)
            await DB.importData(backupData)
            importFile.value = null // Clear input
            log.info('Successfully imported available data', {
                appName: backupData.appName,
                createdAt: backupData.createdAt,
                databaseVersion: backupData.databaseVersion,
            })
        } catch (error) {
            log.error('Error during import', error as Error)
        }
    })
}

/**
 * Exports all app data into a JSON file.
 * Settings Page only.
 */
function onExport() {
    const appNameSlug = appName.toLowerCase().split(' ').join('-')
    const date = new Date().toISOString().split('T')[0]
    const filename = `${appNameSlug}-${date}.json`

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Export',
            message: `Export all app data into the backup file ${filename}?`,
            color: 'info',
            icon: exportFileIcon,
        },
    }).onOk(async () => {
        try {
            const backupData = await DB.exportData()

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
    })
}

/**
 * Deletes all app logs.
 * Settings Page only.
 */
function onDeleteLogs() {
    $q.dialog({
        component: DialogConfirmStrict,
        componentProps: {
            title: 'Delete Logs',
            message: 'Are you sure you want to delete all app logs?',
            color: 'negative',
            icon: deleteIcon,
            code: 'YES',
        },
    }).onOk(async () => {
        try {
            await DB.clearTable(TableEnum.LOGS)
            log.info('Successfully deleted logs')
        } catch (error) {
            log.error(`Error deleting Logs`, error as Error)
        }
    })
}

/**
 * Deletes all app data including configuration and user data.
 * Settings Page only.
 */
function onDeleteAppData() {
    $q.dialog({
        component: DialogConfirmStrict,
        componentProps: {
            title: 'Delete App Data',
            message: 'Are you sure you want to delete all app data?',
            color: 'negative',
            icon: deleteXIcon,
            code: 'YES',
        },
    }).onOk(async () => {
        try {
            await DB.clearAppData()
            log.info('Successfully deleted app data')
        } catch (error) {
            log.error(`Error deleting app data`, error as Error)
        }
    })
}

/**
 * Deletes the underlining database and all of its data.
 * Settings Page only.
 */
function onDeleteDatabase() {
    $q.dialog({
        component: DialogConfirmStrict,
        componentProps: {
            title: 'Delete Database',
            message:
                'Delete the underlining database? All data will be lost. You must reload the website after this action to reinitialize the database.',
            color: 'negative',
            icon: deleteSweepIcon,
            code: 'YES',
        },
    }).onOk(async () => {
        try {
            await DB.deleteDatabase()
            notify({ message: 'Reload the website now', icon: warnIcon, color: 'warning' })
        } catch (error) {
            log.error(`Error deleting database`, error as Error)
        }
    })
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
                :to="{ name: RouteNameEnum.TABLE, params: { slugTable: SlugTableEnum.LOGS } }"
            />
            <q-fab-action
                glossy
                :icon="settingsTableIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Settings"
                :to="{ name: RouteNameEnum.TABLE, params: { slugTable: SlugTableEnum.SETTINGS } }"
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
                    <q-item-label>Show Instructions Overlay</q-item-label>
                    <q-item-label caption>
                        Provides helpful information on app usage on startup.
                    </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle
                        :model-value="
                            settingsStore.getSettingValue(SettingIdEnum.INSTRUCTIONS_OVERLAY)
                        "
                        @update:model-value="
                            DB.putRecord({
                                id: SettingIdEnum.INSTRUCTIONS_OVERLAY,
                                value: $event,
                            })
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
                        :model-value="settingsStore.getSettingValue(SettingIdEnum.INFO_MESSAGES)"
                        @update:model-value="
                            DB.putRecord({
                                id: SettingIdEnum.INFO_MESSAGES,
                                value: $event,
                            })
                        "
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
                        :model-value="settingsStore.getSettingValue(SettingIdEnum.CONSOLE_LOGS)"
                        @update:model-value="
                            DB.putRecord({
                                id: SettingIdEnum.CONSOLE_LOGS,
                                value: $event,
                            })
                        "
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
                        :model-value="
                            settingsStore.getSettingValue(SettingIdEnum.LOG_RETENTION_DURATION)
                        "
                        @update:model-value="
                            DB.putRecord({
                                id: SettingIdEnum.LOG_RETENTION_DURATION,
                                value: $event,
                            })
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
                        @rejected="onRejectedFile"
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
            <q-item class="q-mt-lg">
                <q-item-section top>
                    <q-item-label>Testing</q-item-label>
                    <q-item-label caption>
                        <q-btn :icon="createIcon" color="accent" @click="DB.testRecords()" />
                    </q-item-label>
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>

<style scoped>
.duration-width {
    width: 150px;
}
</style>
