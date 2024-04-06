import type Example from '@/models/Example'
import type Setting from '@/models/Setting'
import type { SettingKeyType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Store meant to hold record sets that are being live queried from Dexie. These are going to be
 * Parent datasets that are unlikely to grow very quickly.
 */
const useLiveStore = defineStore({
    id: 'live',

    state: () => ({
        settings: [] as Setting[],
        examples: [] as Example[],
    }),

    getters: {
        getSettingValue: (state) => (key: SettingKeyType) => {
            return state.settings.find((setting) => setting.key === key)?.value
        },
    },
})

export default useLiveStore
