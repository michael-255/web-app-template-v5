<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import logService from '@/services/LogService'
import settingService from '@/services/SettingService'
import DB from '@/services/db'
import { appDescription } from '@/shared/constants'
import { errorIcon } from '@/shared/icons'
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

/**
 * Only need to load live Settings once, then use them throughout the app.
 * Other datasets should only be loaded when they are used because they could grow very large.
 */
const subscription = settingService.liveTable(DB).subscribe({
    next: (records) => {
        settingsStore.settings = records
    },
    error: (error) => {
        log.error('Error loading live Settings', error as Error)
    },
})

onMounted(async () => {
    try {
        const settings = await settingService.initSettings(DB)
        log.silentDebug('Settings initialized', settings)
    } catch (error) {
        // This isn't saving the error since it could be a DB or logger failure
        notify({ message: 'Error initializing settings', icon: errorIcon, color: 'negative' })
        console.error(error)
    }

    try {
        const logsPurged = await logService.purgeLogs(DB)
        log.silentDebug('Expired logs purged', { logsPurged })
    } catch (error) {
        log.error('Error purging expired logs', error as Error)
    }
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <RouterView />
</template>
