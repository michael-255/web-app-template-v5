import { MenuLayout } from '@/layouts'
import { ExamplesPage } from '@/pages'
import { Enum } from '@/shared'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            redirect: '/examples', // Your default route
            name: Enum.RouteName.MENU_LAYOUT,
            component: MenuLayout, // Must use a different layout for other primary routes
            children: [
                {
                    path: '/examples',
                    name: Enum.RouteName.EXAMPLES,
                    component: ExamplesPage,
                },
                {
                    path: '/example-config-data',
                    name: Enum.RouteName.EXAMPLE_CONFIGS_TABLE,
                    component: () => import('@/pages/ExampleConfigsTablePage.vue'),
                },
                {
                    path: '/example-result-data',
                    name: Enum.RouteName.EXAMPLE_RESULTS_TABLE,
                    component: () => import('@/pages/ExampleResultsTablePage.vue'),
                },
                {
                    path: '/settings',
                    name: Enum.RouteName.SETTINGS,
                    component: () => import('@/pages/SettingsPage.vue'),
                },
                {
                    path: '/log-data',
                    name: Enum.RouteName.LOGS_TABLE,
                    component: () => import('@/pages/LogsTablePage.vue'),
                },
                {
                    path: '/about',
                    name: Enum.RouteName.ABOUT,
                    component: () => import('@/pages/AboutPage.vue'),
                },
                {
                    path: '/donate',
                    name: Enum.RouteName.DONATE,
                    component: () => import('@/pages/DonatePage.vue'),
                },
                {
                    path: '/:pathMatch(.*)*', // 404 Not Found
                    name: Enum.RouteName.NOT_FOUND,
                    component: () => import('@/pages/NotFoundPage.vue'),
                },
            ],
        },
    ],
})

export default router
