import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useDialogs from '@/composables/useDialogs'
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
    const { dialogConfirmStrict } = useDialogs()
    const { log } = useLogger()
    const selectedStore = useSelectedStore()

    //
    // Miscellaneous
    //

    /**
     * Fullscreen dialog that provides a human readable view of a model's data.
     */
    function onInspectDialog(table: Exclude<DBTableEnum, DBTableEnum.SETTINGS>, id: UUIDType) {
        $q.dialog({
            component: DialogInspect,
            componentProps: { table, id },
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

    //
    // Delete
    //

    function onDeleteRecord(
        table: Exclude<DBTableEnum, DBTableEnum.SETTINGS | DBTableEnum.LOGS>,
        id: UUIDType,
    ) {
        dialogConfirmStrict(
            'Delete Record',
            `Are you sure you want to delete ${id}?`,
            'negative',
            deleteIcon,
            'YES',
            async () => {
                try {
                    const deletedRecord = await DB.deleteRecord(table, id)
                    log.info(`Deleted record`, deletedRecord)
                } catch (error) {
                    log.error(`Error deleting record`, error as Error)
                }
            },
        )
    }

    return {
        onInspectDialog,
        onTagToggle,
        onDeleteRecord,
    }
}
