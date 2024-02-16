import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ExampleConfigInspectionDialog from '@/components/dialogs/ExampleConfigInspectionDialog.vue'
import ExampleResultInspectionDialog from '@/components/dialogs/ExampleResultInspectionDialog.vue'
import LogInspectionDialog from '@/components/dialogs/LogInspectionDialog.vue'
import type ExampleConfig from '@/models/ExampleConfig'
import type ExampleResult from '@/models/ExampleResult'
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

    function logInspectDialog(log: Log) {
        $q.dialog({
            component: LogInspectionDialog,
            componentProps: { log },
        })
    }

    function exampleConfigInspectDialog(exampleConfig: ExampleConfig) {
        $q.dialog({
            component: ExampleConfigInspectionDialog,
            componentProps: { exampleConfig },
        })
    }

    function exampleResultInspectDialog(exampleResult: ExampleResult) {
        $q.dialog({
            component: ExampleResultInspectionDialog,
            componentProps: { exampleResult },
        })
    }

    return {
        confirmDialog,
        logInspectDialog,
        exampleConfigInspectDialog,
        exampleResultInspectDialog,
    }
}
