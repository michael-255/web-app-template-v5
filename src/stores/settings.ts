import type { Setting } from '@/models'
import { Type } from '@/shared'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as Setting[],
    }),

    getters: {
        getValue: (state) => (key: Type.SettingKey) => {
            return state.settings.find((setting) => setting.key === key)?.value
        },
    },
})
