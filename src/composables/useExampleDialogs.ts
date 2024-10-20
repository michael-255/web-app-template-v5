import DialogChartExample from '@/components/dialogs/chart/DialogChartExample.vue'
import DialogCreateExample from '@/components/dialogs/create/DialogCreateExample.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogEditExample from '@/components/dialogs/edit/DialogEditExample.vue'
import DialogInspectExample from '@/components/dialogs/inspect/DialogInspectExample.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example, { type ExampleType } from '@/models/Example'
import ExampleService from '@/services/ExampleService'
import { StatusEnum } from '@/shared/enums'
import { deleteIcon, favoriteOffIcon, favoriteOnIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { extend, useQuasar } from 'quasar'

export default function useExampleDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog } = useDialogs()
    const selectedStore = useSelectedStore()

    function toggleFavoriteExampleDialog(example: ExampleType) {
        const recordDeepCopy: ExampleType = extend(true, {}, example)
        const action = recordDeepCopy.status.includes(StatusEnum.FAVORITED)
            ? 'Unfavorite'
            : 'Favorite'

        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: action,
                message: `Do you want to ${action.toLocaleLowerCase()} ${recordDeepCopy.name}?`,
                color: 'info',
                icon: recordDeepCopy.status.includes(StatusEnum.FAVORITED)
                    ? favoriteOffIcon
                    : favoriteOnIcon,
                useConfirmationCode: 'NEVER',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                await ExampleService.toggleFavorite(recordDeepCopy)
                log.info(`${action}d ${recordDeepCopy.name}`, recordDeepCopy)
            } catch (error) {
                log.error(`${action} failed`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    async function chartExampleDialog(id: string) {
        const record = await ExampleService.get(id)
        if (!record) {
            log.error('Example not found')
            return
        }
        selectedStore.example = record
        showDialog({ component: DialogChartExample })
    }

    async function inspectExampleDialog(id: string) {
        const record = await ExampleService.get(id)
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
        const record = await ExampleService.get(id)
        if (!record) {
            log.error('Example not found')
            return
        }
        selectedStore.example = record
        showDialog({ component: DialogEditExample })
    }

    async function deleteExampleDialog(id: IdType) {
        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: 'Delete Example',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                const deletedRecord = await ExampleService.remove(id)
                log.info(`Deleted Example`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting Example`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
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
