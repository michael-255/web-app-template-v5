import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import ExampleConfigInspectionDialog from '@/components/dialogs/ExampleConfigInspectionDialog.vue'
import ExampleResultInspectionDialog from '@/components/dialogs/ExampleResultInspectionDialog.vue'
import LogInspectionDialog from '@/components/dialogs/LogInspectionDialog.vue'
import ExampleConfig from '@/models/ExampleConfig'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import { useQuasar } from 'quasar'
import useLogger from './useLogger'

export default function useDialogs() {
    const { log } = useLogger()
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

    function inspectDialog<T extends Log | ExampleConfig | ExampleResult>(model: T) {
        if (model instanceof Log) {
            $q.dialog({
                component: LogInspectionDialog,
                componentProps: { log: model },
            })
        } else if (model instanceof ExampleConfig) {
            $q.dialog({
                component: ExampleConfigInspectionDialog,
                componentProps: { exampleConfig: model },
            })
        } else if (model instanceof ExampleResult) {
            $q.dialog({
                component: ExampleResultInspectionDialog,
                componentProps: { exampleResult: model },
            })
        } else {
            log.error('Invalid model type for inspection dialog', model)
        }
    }

    return {
        confirmDialog,
        inspectDialog,
    }
}
