import type Setting from '@/models/Setting'
import type { SettingKeyType } from '@/shared/types'
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
        getSettingValue: (state) => (key: SettingKeyType) => {
            return state.settings.find((s) => s.key === key)?.value
        },
    },
})

export default useSettingsStore
