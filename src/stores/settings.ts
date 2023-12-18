import type { Setting } from '@/models'
import { defineStore } from 'pinia'

export const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as Setting[],
    }),
})
