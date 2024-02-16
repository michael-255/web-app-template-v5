import MenuLayout from '@/layouts/MenuLayout.vue'
import ExamplesPage from '@/pages/ExamplesPage.vue'
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
                    name: RouteNameEnum.EXAMPLES,
                    component: ExamplesPage,
                },
                {
                    path: '/example-configs-table',
                    name: RouteNameEnum.EXAMPLE_CONFIGS_TABLE,
                    component: () => import('@/pages/ExampleConfigsTablePage.vue'),
                },
                {
                    path: '/example-results-table',
                    name: RouteNameEnum.EXAMPLE_RESULTS_TABLE,
                    component: () => import('@/pages/ExampleResultsTablePage.vue'),
                },
                {
                    path: '/settings',
                    name: RouteNameEnum.SETTINGS,
                    component: () => import('@/pages/SettingsPage.vue'),
                },
                {
                    path: '/logs-table',
                    name: RouteNameEnum.LOGS_TABLE,
                    component: () => import('@/pages/LogsTablePage.vue'),
                },
                {
                    path: '/settings-table',
                    name: RouteNameEnum.SETTINGS_TABLE,
                    component: () => import('@/pages/SettingsTablePage.vue'),
                },
                {
                    path: '/about',
                    name: RouteNameEnum.ABOUT,
                    component: () => import('@/pages/AboutPage.vue'),
                },
                {
                    path: '/donate',
                    name: RouteNameEnum.DONATE,
                    component: () => import('@/pages/DonatePage.vue'),
                },
                {
                    path: '/:pathMatch(.*)*', // 404 Not Found
                    name: RouteNameEnum.NOT_FOUND,
                    component: () => import('@/pages/NotFoundPage.vue'),
                },
            ],
        },
    ],
})

export default router
