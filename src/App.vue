<script setup lang="ts">
import { Constant } from '@/shared'
import { colors, useMeta } from 'quasar'
import { RouterView } from 'vue-router'

/**
 * Sets up meta tags and links for the app. These are primarily for the favicons and manifest.
 * Do NOT overwrite these specific properties in another useMeta().
 */
useMeta({
    meta: {
        description: { name: 'description', content: Constant.AppDescription },
        charset: { charset: 'UTF-8' },
        viewport: {
            name: 'viewport',
            content: 'width=device-width, initial-scale=1.0',
        },
        themeColor: { name: 'theme-color', content: `${colors.getPaletteColor('primary')}` },
    },

    // link: {
    //     manifest: {
    //         rel: 'manifest',
    //         href: `${import.meta.env.BASE_URL}manifest.json`,
    //     },
    //     appleTouchIcon: {
    //         rel: 'apple-touch-icon',
    //         sizes: '180x180',
    //         href: `${import.meta.env.BASE_URL}apple-touch-icon.png`,
    //     },
    //     favicon32: {
    //         rel: 'icon',
    //         type: 'image/png',
    //         sizes: '32x32',
    //         href: `${import.meta.env.BASE_URL}favicon-32x32.png`,
    //     },
    //     favicon16: {
    //         rel: 'icon',
    //         type: 'image/png',
    //         sizes: '16x16',
    //         href: `${import.meta.env.BASE_URL}favicon-16x16.png`,
    //     },
    // },

    noscript: {
        default:
            'Your browser does not support JavaScript or has it disabled. Please enable JavaScript in your web browser settings or white-list our domain in your JavaScript blocker for the best experience.',
    },
})
</script>

<template>
    <RouterView />
</template>
