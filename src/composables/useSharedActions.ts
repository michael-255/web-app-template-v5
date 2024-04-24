import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/Database'
import DatabaseService from '@/services/DatabaseService'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { useQuasar } from 'quasar'

export default function useSharedActions() {
    const $q = useQuasar()
    const { log } = useLogger()

    /**
     * Fullscreen dialog that provides a human readable view of a model's data.
     */
    async function onInspectDialog(id: IdType) {
        const Service = DatabaseService.getService(id)
        const model = await Service.get(DB, id)
        $q.dialog({
            component: DialogInspect,
            componentProps: { model },
        })
    }

    /**
     * Generic record deletion function. Not for use with SETTINGS or LOGS tables.
     */
    function onDeleteRecord(id: IdType) {
        $q.dialog({
            component: DialogConfirmStrict,
            componentProps: {
                title: 'Delete Record',
                message: `Are you sure you want to delete ${id}?`,
                color: 'negative',
                icon: deleteIcon,
                code: 'YES',
            },
        }).onOk(async () => {
            try {
                const Service = DatabaseService.getService(id)
                const deletedRecord = await Service.delete(DB, id)
                log.info(`Deleted record`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting record`, error as Error)
            }
        })
    }

    return {
        onInspectDialog,
        onDeleteRecord,
    }
}
