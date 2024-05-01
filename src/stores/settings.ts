import type Setting from '@/models/Setting'
import { SettingIdEnum } from '@/shared/enums'
import { defineStore } from 'pinia'

/**
 * Should be initialized on app startup in `App.vue`.
 */
const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as Setting[],
    }),

    getters: {
        getSettingValue: (state) => (id: SettingIdEnum) => {
            return state.settings.find((s) => s.id === id)?.value
        },
    },
})

export default useSettingsStore
