import { type SettingsType } from '@/models/Settings'
import { defineStore } from 'pinia'

/**
 * Should be initialized on app startup in `App.vue`.
 */
export const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: {} as SettingsType,
    }),
})
