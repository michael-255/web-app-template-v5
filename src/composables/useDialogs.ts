import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogDismiss from '@/components/dialogs/DialogDismiss.vue'
import DialogInspectExample from '@/components/dialogs/DialogInspectExample.vue'
import DialogInspectExampleResult from '@/components/dialogs/DialogInspectExampleResult.vue'
import DialogInspectLog from '@/components/dialogs/DialogInspectLog.vue'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import { useQuasar } from 'quasar'
import useLogger from './useLogger'

export default function useDialogs() {
    const { log } = useLogger()
    const $q = useQuasar()

    function dialogConfirm(
        title: string,
        message: string,
        color: string,
        icon: string,
        onOkFunc: () => void,
    ) {
        $q.dialog({
            component: DialogConfirm,
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

    function dialogDismiss(
        title: string,
        message: string,
        color: string,
        icon: string,
        onOkFunc: () => void,
    ) {
        $q.dialog({
            component: DialogDismiss,
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

    function dialogInspect<T extends Log | Example | ExampleResult>(model: T) {
        if (model instanceof Log) {
            $q.dialog({
                component: DialogInspectLog,
                componentProps: { model },
            })
        } else if (model instanceof Example) {
            $q.dialog({
                component: DialogInspectExample,
                componentProps: { model },
            })
        } else if (model instanceof ExampleResult) {
            $q.dialog({
                component: DialogInspectExampleResult,
                componentProps: { model },
            })
        } else {
            log.error('Cannot inspect unknown model type', { model })
        }
    }

    return {
        dialogConfirm,
        dialogDismiss,
        dialogInspect,
    }
}
