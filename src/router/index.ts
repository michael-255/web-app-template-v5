import MenuLayout from '@/layouts/LayoutMenu.vue'
import PageDashboardExamples from '@/pages/PageDashboardExamples.vue'
import { RouteNameEnum } from '@/shared/enums'
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
                    path: '/create-example',
                    name: RouteNameEnum.CREATE_EXAMPLE,
                    component: () => import('@/pages/PageCreateExample.vue'),
                },
                {
                    path: '/create-example-result',
                    name: RouteNameEnum.CREATE_EXAMPLE_RESULT,
                    component: () => import('@/pages/PageCreateExampleResult.vue'),
                },
                {
                    path: '/edit-example',
                    name: RouteNameEnum.EDIT_EXAMPLE,
                    component: () => import('@/pages/PageEditExample.vue'),
                },
                {
                    path: '/edit-example-result',
                    name: RouteNameEnum.EDIT_EXAMPLE_RESULT,
                    component: () => import('@/pages/PageEditExampleResult.vue'),
                },
                {
                    path: '/examples-table',
                    name: RouteNameEnum.EXAMPLES_TABLE,
                    component: () => import('@/pages/PageTableExamples.vue'),
                },
                {
                    path: '/example-results-table',
                    name: RouteNameEnum.EXAMPLE_RESULTS_TABLE,
                    component: () => import('@/pages/PageTableExampleResults.vue'),
                },
                {
                    path: '/logs-table',
                    name: RouteNameEnum.LOGS_TABLE,
                    component: () => import('@/pages/PageTableLogs.vue'),
                },
                {
                    path: '/settings-table',
                    name: RouteNameEnum.SETTINGS_TABLE,
                    component: () => import('@/pages/PageTableSettings.vue'),
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
