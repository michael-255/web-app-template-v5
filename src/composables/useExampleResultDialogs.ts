import DialogCreateExampleResult from '@/components/dialogs/create/DialogCreateExampleResult.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogEditExampleResult from '@/components/dialogs/edit/DialogEditExampleResult.vue'
import DialogInspectExampleResult from '@/components/dialogs/inspect/DialogInspectExampleResult.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import ExampleResultService from '@/services/ExampleResultService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'

export default function useExampleResultDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const { showDialog } = useDialogs()
    const selectedStore = useSelectedStore()

    async function inspectExampleResultDialog(id: string) {
        const record = await ExampleResultService.get(id)
        if (!record) {
            log.error('Example Result not found')
            return
        }
        selectedStore.exampleResult = record
        showDialog({ component: DialogInspectExampleResult })
    }

    async function createExampleResultDialog(parentId?: IdType) {
        if (parentId) {
            selectedStore.exampleResult = new ExampleResult({ parentId })
        } else {
            selectedStore.exampleResult = new ExampleResult({ parentId: undefined! })
        }
        showDialog({ component: DialogCreateExampleResult })
    }

    async function editExampleResultDialog(id: string) {
        const record = await ExampleResultService.get(id)
        if (!record) {
            log.error('Example Result not found')
            return
        }
        selectedStore.exampleResult = record
        showDialog({ component: DialogEditExampleResult })
    }

    async function deleteExampleResultDialog(id: IdType) {
        $q.dialog({
            component: DialogConfirm,
            componentProps: {
                title: 'Delete Example Result',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                useConfirmationCode: 'ADVANCED-MODE-CONTROLLED',
            },
        }).onOk(async () => {
            try {
                $q.loading.show()
                const deletedRecord = await ExampleResultService.remove(id)
                log.info(`Deleted Example Result`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting Example Result`, error as Error)
            } finally {
                $q.loading.hide()
            }
        })
    }

    return {
        inspectExampleResultDialog,
        createExampleResultDialog,
        editExampleResultDialog,
        deleteExampleResultDialog,
    }
}
