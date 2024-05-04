import MenuLayout from '@/layouts/LayoutMenu.vue'
import PageDashboard from '@/pages/PageDashboard.vue'
import PageTable from '@/pages/PageTable.vue'
import DatabaseManager from '@/services/DatabaseManager'
import { GroupEnum, RouteNameEnum, RouteTableEnum } from '@/shared/enums'
import { routeTableSchema } from '@/shared/schemas'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: `/${RouteTableEnum.EXAMPLES}/dashboard`, // Your default route
            name: RouteNameEnum.MENU_LAYOUT,
            component: MenuLayout, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/:routeTable/dashboard',
                    name: RouteNameEnum.DASHBOARD,
                    component: PageDashboard,
                    beforeEnter: (to: any, _: any, next: Function) => {
                        const routeTable = to.params.routeTable
                        const isRouteTableValid = routeTableSchema.safeParse(routeTable).success

                        if (!isRouteTableValid) {
                            return next({ name: RouteNameEnum.NOT_FOUND })
                        }

                        const group = DatabaseManager.getService(routeTable).group
                        if (group !== GroupEnum.PARENT) {
                            return next({ name: RouteNameEnum.NOT_FOUND })
                        }

                        return next()
                    },
                },
                {
                    path: '/:routeTable/table',
                    name: RouteNameEnum.TABLE,
                    component: PageTable,
                    beforeEnter: (to: any, _: any, next: Function) => {
                        const routeTable = to.params.routeTable
                        const isRouteTableValid = routeTableSchema.safeParse(routeTable).success

                        if (!isRouteTableValid) {
                            return next({ name: RouteNameEnum.NOT_FOUND })
                        }

                        return next()
                    },
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

export default router
