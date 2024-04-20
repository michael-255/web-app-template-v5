import type { DBRecordType } from '@/shared/types'
import { defineStore } from 'pinia'

/**
 * Store meant to hold the currently selected record for use on forms like Create and Edit.
 * The reason we don't store the specific type here is because we want to be able to reuse the field
 * components with multiple record types.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        record: {} as DBRecordType,
    }),
})

export default useSelectedStore
