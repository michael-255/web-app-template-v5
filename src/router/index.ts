import { DashboardLayout } from '@/layouts'
import { DashboardPage } from '@/pages'
import { Enum } from '@/shared'
import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: Enum.RouteName.DASHBOARD_LAYOUT,
            component: DashboardLayout,
            redirect: '/',
            children: [
                {
                    path: '/',
                    name: Enum.RouteName.DASHBOARD,
                    component: DashboardPage,
                },
                {
                    path: '/about',
                    name: Enum.RouteName.ABOUT,
                    component: () => import('@/pages/AboutPage.vue'),
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
