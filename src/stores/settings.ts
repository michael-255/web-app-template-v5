import { SettingIdEnum } from '@/shared/enums'
import type { SettingType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Should be initialized on app startup in `App.vue`.
 */
export const useSettingsStore = defineStore({
    id: 'settings',

    state: () => ({
        settings: [] as SettingType[],
    }),

    getters: {
        advancedMode: (state) => {
            return state.settings.find((s: SettingType) => s.id === SettingIdEnum.ADVANCED_MODE)
                ?.value
        },
        consoleLogs: (state) => {
            return state.settings.find((s: SettingType) => s.id === SettingIdEnum.CONSOLE_LOGS)
                ?.value
        },
        infoMessages: (state) => {
            return state.settings.find((s: SettingType) => s.id === SettingIdEnum.INFO_MESSAGES)
                ?.value
        },
        instructionsOverlay: (state) => {
            return state.settings.find(
                (s: SettingType) => s.id === SettingIdEnum.INSTRUCTIONS_OVERLAY,
            )?.value
        },
        logRetentionDuration: (state) => {
            return state.settings.find(
                (s: SettingType) => s.id === SettingIdEnum.LOG_RETENTION_DURATION,
            )?.value
        },
    },
})
