import type Setting from '@/models/Setting'
import type { SettingKeyType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Storing Settings for quick and easy live access. Should by initialized in App.vue.
 */
const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as Setting[],
    }),

    getters: {
        getSettingValue: (state) => (key: SettingKeyType) => {
            return state.settings.find((setting) => setting.key === key)?.value
        },
    },
})

export default useSettingsStore
