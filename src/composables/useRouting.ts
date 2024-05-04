import useLogger from '@/composables/useLogger'
import { RouteNameEnum, RouteTableEnum } from '@/shared/enums'
import { routeTableSchema } from '@/shared/schemas'
import { useRoute, useRouter } from 'vue-router'

export default function useRouting() {
    // Do NOT return route or router from a composable
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    // Possible route params
    const routeTableParam = Array.isArray(route.params.routeTable)
        ? route.params.routeTable[0]
        : route.params.routeTable

    // Cleaned route params
    const routeTable = routeTableSchema.safeParse(routeTableParam).success
        ? (routeTableParam as RouteTableEnum)
        : undefined

    function goToTable() {
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { routeTable },
            })
        } catch (error) {
            log.error('Error accessing Table route', error as Error)
        }
    }

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
            log.error('Error accessing previous route', error as Error)
        }
    }

    return {
        routeTable,
        goToTable,
        goBack,
    }
}
