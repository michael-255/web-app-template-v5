import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
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

    /**
     * Simple confirm dialog that's useful for asking the user to confirm an action.
     */
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

    /**
     * Confirm dialog with a text code input that is required to proceed. The code text will be
     * automatically capitalized for user convenience.
     */
    function dialogConfirmStrict(
        title: string,
        message: string,
        color: string,
        icon: string,
        code: string,
        onOkFunc: () => void,
    ) {
        $q.dialog({
            component: DialogConfirmStrict,
            componentProps: {
                title,
                message,
                color,
                icon,
                code,
            },
        }).onOk(() => {
            onOkFunc()
        })
    }

    /**
     * Dismissable message dialog. Useful for warnings, validation errors, etc.
     */
    function dialogDismiss(title: string, message: string, color: string, icon: string) {
        $q.dialog({
            component: DialogDismiss,
            componentProps: {
                title,
                message,
                color,
                icon,
            },
        })
    }

    /**
     * Fullscreen dialog that provides a human readable view of a model's data.
     */
    function dialogInspect(model: Log | Example | ExampleResult) {
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
        dialogConfirmStrict,
        dialogDismiss,
        dialogInspect,
    }
}
