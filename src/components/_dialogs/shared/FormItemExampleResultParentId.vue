<script setup lang="ts">
import useExampleResults from '@/composables/useExampleResults'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import { TagEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref, type Ref } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

defineProps<{
    mutation: 'Create' | 'Edit'
}>()

const $q = useQuasar()
const { log } = useLogger(DB)
const selectedStore = useSelectedStore()
const ExampleResult = useExampleResults(DB)

const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        options.value = await ExampleResult.getSelectOptions()
        const parentIdMatch = options.value.some(
            (i) => i.value === selectedStore.exampleResult.parentId,
        )

        if (!parentIdMatch) {
            selectedStore.exampleResult.parentId = undefined! // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading Parent Id field', error as Error)
    }
})

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.exampleResult.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <BaseFormItem
        label="Parent Example Id"
        description="Id of the parent Example that this child Result is associated with."
    >
        <q-item-label v-if="mutation == 'Edit'" caption class="q-mb-md">
            {{ selectedStore.exampleResult?.parentId ?? '-' }}
        </q-item-label>

        <q-item-label v-else caption>
            <q-select
                :disable="isDisabled"
                v-model="selectedStore.exampleResult.parentId"
                :rules="[(val: string) => idSchema.safeParse(val).success || 'Required']"
                :options="options"
                lazy-rules
                emit-value
                map-options
                options-dense
                dense
                outlined
                color="primary"
            />
        </q-item-label>
    </BaseFormItem>
</template>
