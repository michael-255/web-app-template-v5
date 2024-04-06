import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogDismiss from '@/components/dialogs/DialogDismiss.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import type { DBTableEnum } from '@/shared/enums'
import { useQuasar } from 'quasar'

export default function useDialogs() {
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
    function dialogInspect(model: Record<string, any>, type: DBTableEnum) {
        $q.dialog({
            component: DialogInspect,
            componentProps: { model, type },
        })
    }

    return {
        dialogConfirm,
        dialogConfirmStrict,
        dialogDismiss,
        dialogInspect,
    }
}
