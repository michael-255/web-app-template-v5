import type Example from '@/models/Example'
import { defineStore } from 'pinia'

const useExamplesStore = defineStore({
    id: 'examples',

    state: () => ({
        examples: [] as Example[],
    }),
})

export default useExamplesStore
