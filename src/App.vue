<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import DB from '@/services/Database'
import { appDescription } from '@/shared/constants'
import { errorIcon } from '@/shared/icons'
import useExamplesStore from '@/stores/examples'
import useSettingsStore from '@/stores/settings'
import { colors, useMeta, useQuasar } from 'quasar'
import { onMounted, onUnmounted } from 'vue'
import { RouterView } from 'vue-router'

/**
 * Sets up meta tags and links for the app. These are primarily for the favicons and manifest.
 * Do NOT overwrite these specific properties in another useMeta().
 */
useMeta({
    meta: {
        description: { name: 'description', content: appDescription },
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

const notify = useQuasar().notify
const { log } = useLogger()
const settingsStore = useSettingsStore()
const examplesStore = useExamplesStore()

/**
 * Only need to load live Settings once, then use them throughout the app.
 * Other datasets like logs and results should only be loaded when they are used because they could
 * grow very large in size and slow down the app.
 */
const settingsSubscription = DB.liveSettings().subscribe({
    next: (records) => {
        settingsStore.settings = records
    },
    error: (error) => {
        log.error('Error loading live settings', error as Error)
    },
})

/**
 * Setup all of your parent live data subscriptions below only once and reuse them as needed.
 * The parent datasets should grow much slower than the child datasets.
 */
const examplesSubscription = DB.liveExamples().subscribe({
    next: (records) => {
        examplesStore.examples = records
    },
    error: (error) => {
        log.error('Error loading live examples', error as Error)
    },
})

onMounted(async () => {
    try {
        const settings = await DB.initSettings()
        log.silentDebug('Settings initialized', settings)
    } catch (error) {
        // This isn't saving the error since it could be a DB or logger failure
        notify({ message: 'Error initializing settings', icon: errorIcon, color: 'negative' })
    }

    try {
        const logsPurged = await DB.purgeLogs()
        log.silentDebug('Expired logs purged', { logsPurged })
    } catch (error) {
        log.error('Error purging expired logs', error as Error)
    }
})

onUnmounted(() => {
    settingsSubscription.unsubscribe()
    examplesSubscription.unsubscribe()
})
</script>

<template>
    <RouterView />
</template>
