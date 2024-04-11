import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { ChildTagEnum, DBTableEnum, ParentTagEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import useLiveStore from '@/stores/live'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

export default function useActions() {
    const $q = useQuasar()
    const liveStore = useLiveStore()
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

    function onDeleteExample(selectedId: UUIDType) {
        // Expecting record in the Store since we have the Id
        const model = liveStore.examples.find((example) => example.id === selectedId)!

        dialogConfirmStrict(
            'Delete Example',
            `Are you sure you want to delete ${model.name}?`,
            'negative',
            deleteIcon,
            'YES',
            async () => {
                try {
                    await DB.deleteExample(selectedId)
                    log.info(`Deleted Example`, model)
                } catch (error) {
                    log.error(`Error deleting Example`, error as Error)
                }
            },
        )
    }

    function onDeleteExampleResult(selectedId: UUIDType, liveData: ExampleResult[]) {
        // Expecting record in the DB since we have the Id
        const model = liveData.find((exampleResult) => exampleResult.id === selectedId)!

        dialogConfirmStrict(
            'Delete Example Result',
            `Are you sure you want to delete this record?`,
            'negative',
            deleteIcon,
            'YES',
            async () => {
                try {
                    await DB.deleteExampleResult(selectedId)
                    log.info(`Deleted Example Result`, model)
                } catch (error) {
                    log.error(`Error deleting Example Result`, error as Error)
                }
            },
        )
    }

    return {
        onInspectDialog,
        onTagToggle,
        onDeleteExample,
        onDeleteExampleResult,
    }
}
