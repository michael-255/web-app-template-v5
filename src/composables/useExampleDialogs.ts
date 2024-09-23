import DialogChartExample from '@/components/dialogs/chart/DialogChartExample.vue'
import DialogCreateExample from '@/components/dialogs/create/DialogCreateExample.vue'
import DialogEditExample from '@/components/dialogs/edit/DialogEditExample.vue'
import DialogInspectExample from '@/components/dialogs/inspect/DialogInspectExample.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import ExampleService from '@/services/ExampleService'
import { SettingKeyEnum, StatusEnum } from '@/shared/enums'
import { deleteIcon, favoriteOffIcon, favoriteOnIcon } from '@/shared/icons'
import type { ExampleType } from '@/shared/types/example'
import type { IdType } from '@/shared/types/shared'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useQuasar } from 'quasar'

export default function useExampleDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog, onConfirmDialog, onStrictConfirmDialog } = useDialogs()
    const exampleService = ExampleService()
    const selectedStore = useSelectedStore()
    const settingsStore = useSettingsStore()

    function toggleFavoriteExampleDialog(example: ExampleType) {
        // Deep copy to prevent issues with the database calls later
        const record: ExampleType = extend(true, {}, example)
        const action = record.status.includes(StatusEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
        const message = `Do you want to ${action.toLocaleLowerCase()} ${record.name}?`
        const icon = record.status.includes(StatusEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

        onConfirmDialog({
            title: action,
            message,
            color: 'info',
            icon,
            onOk: async () => {
                try {
                    $q.loading.show()
                    await exampleService.toggleFavorite(record)
                    log.info(`${action}d ${record.name}`, record)
                } catch (error) {
                    log.error(`${action} failed`, error as Error)
                } finally {
                    $q.loading.hide()
                }
            },
        })
    }

    async function chartExampleDialog(id: string) {
        const record = await exampleService.get(id)
        if (!record) {
            log.error('Example not found')
            return
        }
        selectedStore.example = record
        showDialog({ component: DialogChartExample })
    }

    async function inspectExampleDialog(id: string) {
        const record = await exampleService.get(id)
        if (!record) {
            log.error('Example not found')
            return
        }
        selectedStore.example = record
        showDialog({ component: DialogInspectExample })
    }

    async function createExampleDialog() {
        selectedStore.example = new Example({})
        showDialog({ component: DialogCreateExample })
    }

    async function editExampleDialog(id: string) {
        const record = await exampleService.get(id)
        if (!record) {
            log.error('Example not found')
            return
        }
        selectedStore.example = record
        showDialog({ component: DialogEditExample })
    }

    async function deleteExampleDialog(id: IdType) {
        const title = 'Delete Example'
        const message = `Are you sure you want to delete ${id}?`
        const color = 'negative'
        const icon = deleteIcon

        if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
            onConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await confirmDeleteDialog(id)
                },
            })
        } else {
            onStrictConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await confirmDeleteDialog(id)
                },
            })
        }
    }

    async function confirmDeleteDialog(id: IdType) {
        try {
            $q.loading.show()
            const deletedRecord = await exampleService.remove(id)
            log.info(`Deleted Example`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting Example`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    return {
        toggleFavoriteExampleDialog,
        chartExampleDialog,
        inspectExampleDialog,
        createExampleDialog,
        editExampleDialog,
        deleteExampleDialog,
    }
}
