import { Icon } from '@/shared/enums'
import { useQuasar } from 'quasar'

export default function useNotifications() {
    const $q = useQuasar()

    function notify(message: string, icon: Icon = Icon.INFO, color: string = 'info') {
        $q.notify({
            message,
            icon,
            color,
        })
    }

    return { notify }
}
