import type Setting from '@/models/Setting'
import { SettingIdEnum } from '@/shared/enums'
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
        getSettingValue: (state) => (id: SettingIdEnum) => {
            return state.settings.find((setting) => setting.id === id)?.value
        },
    },
})

export default useSettingsStore
