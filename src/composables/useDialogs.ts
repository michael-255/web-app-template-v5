import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogCreateExampleConfig from '@/components/dialogs/DialogCreateExampleConfig.vue'
import DialogCreateExampleResult from '@/components/dialogs/DialogCreateExampleResult.vue'
import DialogEditExampleConfig from '@/components/dialogs/DialogEditExampleConfig.vue'
import DialogEditExampleResult from '@/components/dialogs/DialogEditExampleResult.vue'
import DialogInspectExampleConfig from '@/components/dialogs/DialogInspectExampleConfig.vue'
import DialogInspectExampleResult from '@/components/dialogs/DialogInspectExampleResult.vue'
import DialogInspectLog from '@/components/dialogs/DialogInspectLog.vue'
import ExampleConfig from '@/models/ExampleConfig'
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

    function dialogInspect<T extends Log | ExampleConfig | ExampleResult>(model: T) {
        if (model instanceof Log) {
            $q.dialog({
                component: DialogInspectLog,
                componentProps: { model },
            })
        } else if (model instanceof ExampleConfig) {
            $q.dialog({
                component: DialogInspectExampleConfig,
                componentProps: { model },
            })
        } else if (model instanceof ExampleResult) {
            $q.dialog({
                component: DialogInspectExampleResult,
                componentProps: { model },
            })
        } else {
            log.error('Cannot inspect unknown', { model })
        }
    }

    function dialogCreate<T extends ExampleConfig | ExampleResult>(model: T) {
        if (model instanceof ExampleConfig) {
            $q.dialog({ component: DialogCreateExampleConfig })
        } else if (model instanceof ExampleResult) {
            $q.dialog({ component: DialogCreateExampleResult })
        } else {
            log.error('Cannot create unknown', { model })
        }
    }

    function dialogEdit<T extends ExampleConfig | ExampleResult>(model: T) {
        if (model instanceof ExampleConfig) {
            $q.dialog({
                component: DialogEditExampleConfig,
                componentProps: { model },
            })
        } else if (model instanceof ExampleResult) {
            $q.dialog({
                component: DialogEditExampleResult,
                componentProps: { model },
            })
        } else {
            log.error('Cannot edit unknown', { model })
        }
    }

    return {
        dialogConfirm,
        dialogInspect,
        dialogCreate,
        dialogEdit,
    }
}
