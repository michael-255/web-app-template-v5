import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'

export default function useSharedActions() {
    const { log } = useLogger()
    const { inspectDialog, strictConfirmDialog } = useDialogs()

    /**
     * Opens a fullscreen dialog to inspect a record.
     */
    async function onInspectDialog(id: IdType) {
        const service = DatabaseManager.getService(id)
        inspectDialog({
            labelSingular: service.labelSingular,
            labelPlural: service.labelPlural,
            table: service.table,
            record: await service.get(DB, id),
        })
    }

    /**
     * Generic record deletion function. Not for use with SETTINGS or LOGS tables.
     */
    function onDeleteRecord(id: IdType) {
        strictConfirmDialog({
            title: 'Delete Record',
            message: `Are you sure you want to delete ${id}?`,
            color: 'negative',
            icon: deleteIcon,
            onOk: async () => {
                try {
                    const service = DatabaseManager.getService(id)
                    const deletedRecord = await service.delete(DB, id)
                    log.info(`Deleted record`, deletedRecord)
                } catch (error) {
                    log.error(`Error deleting record`, error as Error)
                }
            },
        })
    }

    return {
        onInspectDialog,
        onDeleteRecord,
    }
}
