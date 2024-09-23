import type { ExampleType } from '@/shared/types/example'
import type { ExampleResultType } from '@/shared/types/example-result'
import type { LogType } from '@/shared/types/log'
import { defineStore } from 'pinia'

/**
 * Storing the currently selected records for any form and whether it is valid.
 */
const useSelectedStore = defineStore({
    id: 'selected',

    state: () => ({
        isLogValid: true,
        isExampleValid: true,
        isExampleResultValid: true,
        log: {} as LogType,
        example: {} as ExampleType,
        exampleResult: {} as ExampleResultType,
    }),
})

export default useSelectedStore
