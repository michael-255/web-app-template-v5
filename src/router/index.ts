import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        // {
        //     path: '/',
        //     name: Enum.RouteName.DASHBOARD,
        //     meta: { layout: 'MenuLayout' },
        //     component: DashboardPage,
        // },
        // {
        //     path: '/about',
        //     name: Enum.RouteName.ABOUT,
        //     meta: { layout: 'MenuLayout' },
        //     component: () => import('@/pages/AboutPage.vue'),
        // },
        // {
        //     path: '/settings',
        //     name: Enum.RouteName.SETTINGS,
        //     meta: { layout: 'MenuLayout' },
        //     component: () => import('@/pages/SettingsPage.vue'),
        // },
        // {
        //     path: '/:pathMatch(.*)*', // 404 Not Found
        //     name: Enum.RouteName.NOT_FOUND,
        //     meta: { layout: 'MenuLayout' },
        //     component: () => import('@/pages/NotFoundPage.vue'),
        // },
        {
            path: '/',
            name: 'home',
            component: HomeView,
        },
        {
            path: '/about',
            name: 'about',
            // route level code-splitting
            // this generates a separate chunk (About.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('../views/AboutView.vue'),
        },
    ],
})

export default router
