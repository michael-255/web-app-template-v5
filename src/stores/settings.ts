import type Setting from '@/models/Setting'
import { SettingIdEnum } from '@/shared/enums'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Should be initialized on app startup in `App.vue`.
 */
const useSettingsStore = defineStore('setttings', () => {
    const settings = ref([] as Setting[])

    const getSettingValue = (id: SettingIdEnum) => {
        return settings.value.find((s) => s.id === id)?.value
    }

    return { settings, getSettingValue }
})

export default useSettingsStore
