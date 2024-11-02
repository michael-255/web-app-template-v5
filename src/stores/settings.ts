import { type SettingsType } from '@/models/Settings'
import { defineStore } from 'pinia'

/**
 * Should be initialized on app startup in `App.vue`.
 */
export const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        appSettings: {} as SettingsType,
    }),

    getters: {
        advancedMode: (state) => {
            return state.appSettings.advancedMode
        },
        consoleLogs: (state) => {
            return state.appSettings.consoleLogs
        },
        infoMessages: (state) => {
            return state.appSettings.infoMessages
        },
        instructionsOverlay: (state) => {
            return state.appSettings.instructionsOverlay
        },
        logRetentionDuration: (state) => {
            return state.appSettings.logRetentionDuration
        },
    },
})
