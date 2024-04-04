import { defineStore } from 'pinia'

/**
 * Store meant to hold the currently selected record for use on forms like Create and Edit.
 * Make sure you cast the record to the correct type when using it. The reason we don't store the
 * specific type here is because we want to be able to reuse the field components with multiple
 * record types.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        record: {} as Record<string, any>,
    }),
})

export default useSelectedStore
