import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { RouteNameEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { UUIDType } from '@/shared/types'
import useLiveStore from '@/stores/live'
import useSelectedStore from '@/stores/selected'
import { useRouter } from 'vue-router'

export default function useActions() {
    const router = useRouter()
    const liveStore = useLiveStore()
    const selectedStore = useSelectedStore()
    const { dialogInspect, dialogConfirmStrict } = useDialogs()
    const { log } = useLogger()

    function onCreateExample() {
        selectedStore.record = new Example()
        console.log('selectedStore.record', selectedStore.record)
        router.push({ name: RouteNameEnum.CREATE_EXAMPLE })
    }

    function onCreateExampleResult() {
        selectedStore.record = new ExampleResult()
        router.push({ name: RouteNameEnum.CREATE_EXAMPLE_RESULT })
    }

    function onInspectExample(selectedId: UUIDType) {
        // Expecting record to be found in DB
        const model = liveStore.examples.find((row) => row.id === selectedId)!
        dialogInspect(model)
    }

    function onInspectExampleResult(liveChildData: ExampleResult[], selectedId: UUIDType) {
        // Expecting record to be found in DB
        const model = liveChildData.find((exampleResult) => exampleResult.id === selectedId)!
        dialogInspect(model)
    }

    /**
     * Parent records are live loaded on app startup so we don't have to pass them in.
     */
    function onEditExample(selectedId: UUIDType) {
        // Expecting record to be found in DB
        selectedStore.record = liveStore.examples.find((example) => example.id === selectedId)!
        router.push({ name: RouteNameEnum.EDIT_EXAMPLE })
    }

    /**
     * Child records are NOT live loaded on app startup so we have to pass them in.
     */
    function onEditExampleResult(liveChildData: ExampleResult[], selectedId: UUIDType) {
        selectedStore.record = liveChildData.find(
            (exampleResult) => exampleResult.id === selectedId,
        )! // Record should be in DB if we have the Id
        router.push({ name: RouteNameEnum.EDIT_EXAMPLE_RESULT })
    }

    function onDeleteExample(selectedId: UUIDType) {
        // Record should be in DB if we have the Id
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

    function onDeleteExampleResult(liveChildData: ExampleResult[], selectedId: UUIDType) {
        // Record should be in DB if we have the Id
        const model = liveChildData.find((exampleResult) => exampleResult.id === selectedId)!

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
        onCreateExample,
        onCreateExampleResult,
        onInspectExample,
        onInspectExampleResult,
        onEditExample,
        onEditExampleResult,
        onDeleteExample,
        onDeleteExampleResult,
    }
}
