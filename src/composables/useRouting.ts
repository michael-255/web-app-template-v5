import { useLogger } from '@/composables/useLogger'
import { useRoute, useRouter } from 'vue-router'

export function useRouting() {
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    /**
     * Go back if previous route state is part of the app history, otherwise go to root path.
     */
    function goBack() {
        try {
            if (router?.options?.history?.state?.back) {
                router.back()
            } else {
                router.push('/')
            }
        } catch (error) {
            log.error('Error accessing go back route', error)
        }
    }

    return {
        route,
        router,
        goBack,
    }
}
