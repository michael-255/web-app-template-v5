import useLogger from '@/composables/useLogger'
import { extractTableFromId } from '@/shared/db-utils'
import { RouteNameEnum, SlugTableEnum, TableEnum } from '@/shared/enums'
import { idSchema, tableSchema } from '@/shared/schemas'
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
    const routeTable = tableSchema.safeParse(table).success
        ? getTableFromSlug(table as SlugTableEnum)
        : undefined

    function getTableFromSlug(slugTable: SlugTableEnum) {
        switch (slugTable) {
            case SlugTableEnum.SETTINGS:
                return TableEnum.SETTINGS
            case SlugTableEnum.LOGS:
                return TableEnum.LOGS
            case SlugTableEnum.EXAMPLES:
                return TableEnum.EXAMPLES
            case SlugTableEnum.EXAMPLE_RESULTS:
                return TableEnum.EXAMPLE_RESULTS
            default:
                throw new Error(`Invalid Table slug: ${slugTable}`)
        }
    }

    function getSlugFromTable(table: TableEnum) {
        switch (table) {
            case TableEnum.SETTINGS:
                return SlugTableEnum.SETTINGS
            case TableEnum.LOGS:
                return SlugTableEnum.LOGS
            case TableEnum.EXAMPLES:
                return SlugTableEnum.EXAMPLES
            case TableEnum.EXAMPLE_RESULTS:
                return SlugTableEnum.EXAMPLE_RESULTS
            default:
                throw new Error(`Invalid Table: ${table}`)
        }
    }

    function goToTable(table: TableEnum) {
        const slugTable = getSlugFromTable(table)
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
        const slugTable = getSlugFromTable(table)
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
        const table = extractTableFromId(id)
        const slugTable = getSlugFromTable(table)
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
