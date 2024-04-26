import useLogger from '@/composables/useLogger'
import DatabaseService from '@/services/DatabaseService'
import { RouteNameEnum, TableEnum } from '@/shared/enums'
import { idSchema, slugTableSchema } from '@/shared/schemas'
import type { IdType } from '@/shared/types'
import { useRoute, useRouter } from 'vue-router'

export default function useRouting() {
    const route = useRoute()
    const router = useRouter()
    const { log } = useLogger()

    // Possible route params
    const id = Array.isArray(route.params.id) ? route.params.id[0] : route.params.id
    const parentId = Array.isArray(route.params.parentId)
        ? route.params.parentId[0]
        : route.params.parentId
    const slugTable = Array.isArray(route.params.slugTable)
        ? route.params.slugTable[0]
        : route.params.slugTable

    // Cleaned route params
    const routeId = idSchema.safeParse(id).success ? (id as IdType) : undefined
    const routeParentId = idSchema.safeParse(parentId).success ? (parentId as IdType) : undefined
    const routeTable = slugTableSchema.safeParse(slugTable).success
        ? DatabaseService.getService(slugTable).table
        : undefined

    function goToTable(table: TableEnum) {
        const slugTable = DatabaseService.getService(table).slugTable
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { slugTable },
            })
        } catch (error) {
            log.error('Error accessing Table route', error as Error)
        }
    }

    function goToCreate(table: TableEnum, parentId?: IdType) {
        const slugTable = DatabaseService.getService(table).slugTable
        try {
            router.push({
                name: RouteNameEnum.CREATE,
                params: { slugTable, parentId },
            })
        } catch (error) {
            log.error('Error accessing Create route', error as Error)
        }
    }

    function goToEdit(id: IdType) {
        const slugTable = DatabaseService.getService(id).slugTable
        try {
            router.push({
                name: RouteNameEnum.EDIT,
                params: { slugTable, id },
            })
        } catch (error) {
            log.error('Error accessing Edit route', error as Error)
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
        routeId,
        routeParentId,
        routeTable,
        goToTable,
        goToCreate,
        goToEdit,
        goBack,
    }
}
