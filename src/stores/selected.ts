import { defineStore } from 'pinia'

/**
 * Store meant to hold the currently selected record for use on Create and Edit forms.
 * Make sure you cast the record to the correct type when using it.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        record: {} as Record<string, any>,
    }),
})

export default useSelectedStore
