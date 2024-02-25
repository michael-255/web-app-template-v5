import type Example from '@/models/Example'
import type ExampleResult from '@/models/ExampleResult'
import { defineStore } from 'pinia'

const useExamplesStore = defineStore({
    id: 'examples',

    state: () => ({
        examples: [] as Example[],
        selectedExample: null as Partial<Example> | null,
        selectedExampleResult: null as ExampleResult | null,
    }),
})

export default useExamplesStore
