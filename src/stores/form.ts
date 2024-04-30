import type { ModelType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Store meant to hold the currently selected record for use on forms like Create and Edit.
 * The reason we don't store the specific type here is because we want to be able to reuse the field
 * components with multiple record types.
 */
const useFormStore = defineStore({
    id: 'form',

    state: () => ({
        loading: false, // Is record action in loading state
        isValid: true, // Is record valid based on form validation
        record: {} as ModelType,
    }),
})

export default useFormStore
