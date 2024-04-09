import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExampleResult from '@/models/ExampleResult'
import type Log from '@/models/Log'
import DB from '@/services/Database'
import { ChildTagEnum, DBTableEnum, ParentTagEnum, RouteNameEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { LogAutoIdType, UUIDType } from '@/shared/types'
import useLiveStore from '@/stores/live'
import useSelectedStore from '@/stores/selected'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

export default function useActions() {
    const router = useRouter()
    const liveStore = useLiveStore()
    const { dialogConfirmStrict, dialogInspect } = useDialogs()
    const { log } = useLogger()
    const selectedStore = useSelectedStore()

    //
    // Miscellaneous
    //

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
    // Inspect
    //

    function onInspectLog(selectedId: LogAutoIdType, liveData: Log[]) {
        // Expecting record in the DB since we have the Id
        const model = liveData.find((logRecord) => logRecord.autoId === Number(selectedId))!
        dialogInspect(model, DBTableEnum.LOGS)
    }

    function onInspectExample(selectedId: UUIDType) {
        // Expecting record in the Store since we have the Id
        const model = liveStore.examples.find((example) => example.id === selectedId)!
        dialogInspect(model, DBTableEnum.EXAMPLES)
    }

    function onInspectExampleResult(selectedId: UUIDType, liveData: ExampleResult[]) {
        // Expecting record in the DB since we have the Id
        const model = liveData.find((exampleResult) => exampleResult.id === selectedId)!
        dialogInspect(model, DBTableEnum.EXAMPLE_RESULTS)
    }

    //
    // Create
    //

    function onCreateExample() {
        router.push({ name: RouteNameEnum.CREATE, params: { table: DBTableEnum.EXAMPLES } })
    }

    function onCreateExampleResult() {
        router.push({ name: RouteNameEnum.CREATE, params: { table: DBTableEnum.EXAMPLE_RESULTS } })
    }

    //
    // Edit
    //

    function onEditExample(selectedId: UUIDType) {
        router.push({
            name: RouteNameEnum.EDIT,
            params: { table: DBTableEnum.EXAMPLES, id: selectedId },
        })
    }

    function onEditExampleResult(selectedId: UUIDType) {
        router.push({
            name: RouteNameEnum.EDIT,
            params: { table: DBTableEnum.EXAMPLE_RESULTS, id: selectedId },
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
        onTagToggle,
        onInspectLog,
        onInspectExample,
        onInspectExampleResult,
        onCreateExample,
        onCreateExampleResult,
        onEditExample,
        onEditExampleResult,
        onDeleteExample,
        onDeleteExampleResult,
    }
}
