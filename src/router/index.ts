import { MenuLayout } from '@/layouts'
import { ExamplesPage, TestsPage } from '@/pages'
import { Enum } from '@/shared'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: Enum.RouteName.MENU_LAYOUT,
            component: MenuLayout, // Must use a different layout for other routes
            redirect: '/',
            children: [
                {
                    path: '/', // Determined as Home tab
                    name: Enum.RouteName.EXAMPLES,
                    component: ExamplesPage,
                },
                {
                    path: '/tests',
                    name: Enum.RouteName.TESTS,
                    component: TestsPage,
                },
                {
                    path: '/settings',
                    name: Enum.RouteName.SETTINGS,
                    component: () => import('@/pages/SettingsPage.vue'),
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
