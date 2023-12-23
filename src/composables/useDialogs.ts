import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import { useQuasar } from 'quasar'

export function useDialogs() {
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

    return {
        confirmDialog,
    }
}
