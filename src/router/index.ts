import MenuLayout from '@/layouts/LayoutMenu.vue'
import PageCreate from '@/pages/PageCreate.vue'
import PageDashboard from '@/pages/PageDashboard.vue'
import PageEdit from '@/pages/PageEdit.vue'
import PageTable from '@/pages/PageTable.vue'
import { RouteNameEnum, SlugTableEnum } from '@/shared/enums'
import { idSchema, slugTableSchema } from '@/shared/schemas'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: `/${SlugTableEnum.EXAMPLES}/dashboard`, // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: MenuLayout, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/:slugTable/dashboard',
                    name: RouteNameEnum.DASHBOARD,
                    component: PageDashboard,
                },
                // TODO - Remove create
                {
                    path: '/:slugTable/create/:parentId?',
                    name: RouteNameEnum.CREATE,
                    component: PageCreate,
                    beforeEnter: validateParameters,
                },
                // TODO - Remove edit
                {
                    path: '/:slugTable/edit/:id',
                    name: RouteNameEnum.EDIT,
                    component: PageEdit,
                    beforeEnter: validateParameters,
                },
                {
                    path: '/:slugTable/table',
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
    const isSlugTableValid = to.params.slugTable
        ? slugTableSchema.safeParse(to.params.slugTable).success
        : true
    const isIdValid = to.params.id ? idSchema.safeParse(to.params.id).success : true
    const isParentIdValid = to.params.parentId
        ? idSchema.safeParse(to.params.parentId).success
        : true

    if (isSlugTableValid && isIdValid && isParentIdValid) {
        next()
    } else {
        next({ name: RouteNameEnum.NOT_FOUND })
    }
}

export default router
