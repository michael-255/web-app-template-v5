import useLogger from '@/composables/useLogger'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import LogService from '@/services/LogService'
import SettingService from '@/services/SettingService'
import { RouteNameEnum, TableEnum } from '@/shared/enums'
import type { ServiceType } from '@/shared/types'
import { useRoute, useRouter } from 'vue-router'

export default function useRouting() {
    // Do NOT return route or router from any composable due to performance issues
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    // Current table used by the route is any
    const routeTable = Array.isArray(route.params.routeTable)
        ? route.params.routeTable[0]
        : route.params.routeTable

    // Service associated with the current route table if any
    let routeService: ServiceType = null!

    switch (routeTable) {
        case TableEnum.SETTINGS:
            routeService = SettingService
            break
        case TableEnum.LOGS:
            routeService = LogService
            break
        case TableEnum.EXAMPLES:
            routeService = ExampleService
            break
        case TableEnum.EXAMPLE_RESULTS:
            routeService = ExampleResultService
            break
    }

    /**
     * Go to the specified data table route.
     */
    function goToTable(table: TableEnum) {
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { table },
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
        routeService,
        goToTable,
        goBack,
    }
}
