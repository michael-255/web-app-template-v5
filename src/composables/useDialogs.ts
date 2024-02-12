import ConfirmDialog from '@/components/dialogs/ConfirmDialog.vue'
import LogInspectionDialog from '@/components/dialogs/LogInspectionDialog.vue'
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

    return {
        confirmDialog,
        logInspectDialog,
    }
}
