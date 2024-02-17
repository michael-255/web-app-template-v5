import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ExampleConfigCreateDialog from '@/components/dialogs/ExampleConfigCreateDialog.vue'
import ExampleConfigInspectionDialog from '@/components/dialogs/ExampleConfigInspectionDialog.vue'
import ExampleResultCreateDialog from '@/components/dialogs/ExampleResultCreateDialog.vue'
import ExampleResultInspectionDialog from '@/components/dialogs/ExampleResultInspectionDialog.vue'
import LogInspectionDialog from '@/components/dialogs/LogInspectionDialog.vue'
import ExampleConfig from '@/models/ExampleConfig'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import { useQuasar } from 'quasar'

export default function useDialogs() {
    const $q = useQuasar()

    function confirmDialog(
        title: string,
        message: string,
        color: string,
        icon: string,
        onOkFunc: () => void,
    ) {
        $q.dialog({
            component: ConfirmDialog,
            componentProps: {
                title,
                message,
                color,
                icon,
            },
        }).onOk(() => {
            onOkFunc()
        })
    }

    function logInspectDialog(model: Log) {
        $q.dialog({
            component: LogInspectionDialog,
            componentProps: { log: model },
        })
    }

    function exampleConfigInspectDialog(model: ExampleConfig) {
        $q.dialog({
            component: ExampleConfigInspectionDialog,
            componentProps: { exampleConfig: model },
        })
    }

    function exampleConfigCreateDialog() {
        $q.dialog({ component: ExampleConfigCreateDialog })
    }

    function exampleConfigEditDialog(model: ExampleConfig) {
        $q.dialog({
            component: ExampleConfigCreateDialog,
            componentProps: { exampleConfig: model },
        })
    }

    function exampleResultInspectDialog(model: ExampleResult) {
        $q.dialog({
            component: ExampleResultInspectionDialog,
            componentProps: { exampleResult: model },
        })
    }

    function exampleResultCreateDialog() {
        $q.dialog({ component: ExampleResultCreateDialog })
    }

    function exampleResultEditDialog(model: ExampleResult) {
        $q.dialog({
            component: ExampleResultCreateDialog,
            componentProps: { exampleResult: model },
        })
    }

    return {
        confirmDialog,
        logInspectDialog,
        exampleConfigInspectDialog,
        exampleConfigCreateDialog,
        exampleConfigEditDialog,
        exampleResultInspectDialog,
        exampleResultCreateDialog,
        exampleResultEditDialog,
    }
}
