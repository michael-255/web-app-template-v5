import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useLogger from '@/composables/useLogger'
import DB from '@/services/Database'
import { ChildTagEnum, DBTableEnum, ParentTagEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

export default function useActions() {
    const $q = useQuasar()
    const { log } = useLogger()
    const selectedStore = useSelectedStore()

    /**
     * Fullscreen dialog that provides a human readable view of a model's data.
     */
    async function onInspectDialog(table: DBTableEnum, id: UUIDType) {
        const model = await DB.getRecord(table, id)
        $q.dialog({
            component: DialogInspect,
            componentProps: { table, model },
        })
    }

    /**
     * Returns computed property that toggles tags in selected record for Parent and Child tags.
     */
    function onTagToggle(tag: ParentTagEnum | ChildTagEnum) {
        return computed({
            get: () => selectedStore.record.tags?.includes(tag),
            set: (value) => {
                if (!selectedStore.record.tags) {
                    selectedStore.record.tags = []
                }
                const index = selectedStore.record.tags.indexOf(tag)
                if (value && index === -1) {
                    selectedStore.record.tags.push(tag)
                } else if (!value && index !== -1) {
                    selectedStore.record.tags.splice(index, 1)
                }
            },
        })
    }

    /**
     * Generic record deletion function. Not for use with SETTINGS or LOGS tables.
     */
    function onDeleteRecord(table: DBTableEnum, id: UUIDType) {
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
                const deletedRecord = await DB.deleteRecord(table, id)
                log.info(`Deleted record`, deletedRecord)
            } catch (error) {
                log.error(`Error deleting record`, error as Error)
            }
        })
    }

    return {
        onInspectDialog,
        onTagToggle,
        onDeleteRecord,
    }
}
