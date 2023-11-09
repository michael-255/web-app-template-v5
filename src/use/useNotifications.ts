import { useQuasar } from 'quasar'

export function useNotifications() {
    const $q = useQuasar()

    function notify(message: string, icon: string, color: string) {
        $q.notify({
            message,
            icon,
            color,
        })
    }

    return { notify }
}
