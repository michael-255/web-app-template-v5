import type { ModelType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected record being operated on by `Create`, `Edit`, and `Inspect`.
 * Use this store to help manage the state of the form and the record being operated on.
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
