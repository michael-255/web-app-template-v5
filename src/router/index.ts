import MenuLayout from '@/layouts/LayoutMenu.vue'
import PageCreate from '@/pages/PageCreate.vue'
import PageDashboardExamples from '@/pages/PageDashboardExamples.vue'
import PageEdit from '@/pages/PageEdit.vue'
import PageTable from '@/pages/PageTable.vue'
import { RouteNameEnum } from '@/shared/enums'
import { dbTableSchema, idSchema } from '@/shared/schemas'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/examples', // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: MenuLayout, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/examples',
                    name: RouteNameEnum.DASHBOARD_EXAMPLES,
                    component: PageDashboardExamples,
                },
                {
                    path: '/:table/create/:parentId?',
                    name: RouteNameEnum.CREATE,
                    component: PageCreate,
                    beforeEnter: validateParameters,
                },
                {
                    path: '/:table/edit/:id',
                    name: RouteNameEnum.EDIT,
                    component: PageEdit,
                    beforeEnter: validateParameters,
                },
                {
                    path: '/:table/table',
                    name: RouteNameEnum.TABLE,
                    component: PageTable,
                    beforeEnter: validateParameters,
                },
                {
                    path: '/settings',
                    name: RouteNameEnum.SETTINGS,
                    component: () => import('@/pages/PageSettings.vue'),
                },
                {
                    path: '/about',
                    name: RouteNameEnum.ABOUT,
                    component: () => import('@/pages/PageAbout.vue'),
                },
                {
                    path: '/donate',
                    name: RouteNameEnum.DONATE,
                    component: () => import('@/pages/PageDonate.vue'),
                },
                {
                    path: '/:pathMatch(.*)*', // 404 Not Found
                    name: RouteNameEnum.NOT_FOUND,
                    component: () => import('@/pages/PageNotFound.vue'),
                },
            ],
        },
    ],
})

/**
 * Reusable validation function for `beforeEnter` route guard that schema checks parameters.
 */
function validateParameters(to: any, _: any, next: Function) {
    const isTableValid = to.params.table ? dbTableSchema.safeParse(to.params.table).success : true
    const isIdValid = to.params.id ? idSchema.safeParse(to.params.id).success : true
    const isParentIdValid = to.params.parentId
        ? idSchema.safeParse(to.params.parentId).success
        : true

    if (isTableValid && isIdValid && isParentIdValid) {
        next()
    } else {
        next({ name: RouteNameEnum.NOT_FOUND })
    }
}

export default router
