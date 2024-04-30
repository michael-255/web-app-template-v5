import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import { RouteNameEnum, TableEnum } from '@/shared/enums'
import { slugTableSchema } from '@/shared/schemas'
import { useRoute, useRouter } from 'vue-router'

export default function useRouting() {
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    // Possible route params
    const slugTable = Array.isArray(route.params.slugTable)
        ? route.params.slugTable[0]
        : route.params.slugTable

    // Cleaned route params
    const routeTable = slugTableSchema.safeParse(slugTable).success
        ? DatabaseManager.getService(slugTable).table
        : undefined

    function goToTable(table: TableEnum) {
        const slugTable = DatabaseManager.getService(table).slugTable
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { slugTable },
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
        route,
        router,
        routeTable,
        goToTable,
        goBack,
    }
}
