import type Setting from '@/models/Setting'
import type { SettingKeyType } from '@/shared/types'
import { defineStore } from 'pinia'

const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as Setting[],
    }),

    getters: {
        getValue: (state) => (key: SettingKeyType) => {
            return state.settings.find((setting) => setting.key === key)?.value
        },
    },
})

export default useSettingsStore
