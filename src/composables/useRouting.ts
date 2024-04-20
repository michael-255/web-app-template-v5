import useLogger from '@/composables/useLogger'
import { RouteNameEnum, type DBTableEnum } from '@/shared/enums'
import { dbTableSchema, idSchema } from '@/shared/schemas'
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
    const table = Array.isArray(route.params.table) ? route.params.table[0] : route.params.table

    // Cleaned route params
    const routeId = idSchema.safeParse(id).success ? (id as IdType) : undefined
    const routeParentId = idSchema.safeParse(parentId).success ? (parentId as IdType) : undefined
    const routeTable = dbTableSchema.safeParse(table).success ? (table as DBTableEnum) : undefined

    function goToTable(table: DBTableEnum) {
        try {
            router.push({
                name: RouteNameEnum.TABLE,
                params: { table },
            })
        } catch (error) {
            log.error('Error accessing data table route', error as Error)
        }
    }

    function goToCreate(table: DBTableEnum, parentId?: IdType) {
        try {
            router.push({
                name: RouteNameEnum.CREATE,
                params: { table, parentId },
            })
        } catch (error) {
            log.error('Error accessing create route', error as Error)
        }
    }

    function goToEdit(table: DBTableEnum, id: IdType) {
        try {
            router.push({
                name: RouteNameEnum.EDIT,
                params: { table, id },
            })
        } catch (error) {
            log.error('Error accessing edit route', error as Error)
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
