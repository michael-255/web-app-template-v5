import type { ModelType } from '@/shared/types'
import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * Storing the currently selected record being operated on by `Create`, `Edit`, and `Inspect`.
 */
const useFormStore = defineStore('form', () => {
    const isLoading = ref(false)
    const isValid = ref(true)
    const record = ref({} as ModelType)

    return { isLoading, isValid, record }
})

export default useFormStore
