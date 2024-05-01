import type { ModelType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected record being operated on by `Create`, `Edit`, and `Inspect`.
 */
const useFormStore = defineStore({
    id: 'form',

    state: () => ({
        isLoading: false,
        isValid: true,
        record: {} as ModelType,
    }),
})

export default useFormStore
