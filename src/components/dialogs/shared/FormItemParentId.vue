<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import ExampleResultsService from '@/services/ExampleResultsService'
import { idSchema } from '@/shared/schemas'
import type { IdType } from '@/shared/types'
import { onMounted, ref, type Ref } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const props = defineProps<{
    label?: string
    description?: string
    isDisabled: boolean
    selectedParentId: IdType
}>()

const { log } = useLogger(DB)
const exampleResultsService = ExampleResultsService(DB)

const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        options.value = await exampleResultsService.getSelectOptions()
        const parentIdMatch = options.value.some((i) => i.value === props.selectedParentId)

        if (!parentIdMatch) {
            emit('update:selectedParentId', undefined) // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading Parent Id options', error as Error)
    }
})

const emit = defineEmits(['update:selectedParentId'])

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:selectedParentId', target.value)
}
</script>

<template>
    <BaseFormItem
        :label="label || 'Parent Id'"
        :description="
            description || 'Id of the parent record that this child record is associated with.'
        "
    >
        <q-select
            @input="handleInput"
            :modelValue="selectedParentId"
            :rules="[(val: string) => idSchema.safeParse(val).success || 'Required']"
            :disable="isDisabled"
            :options="options"
            lazy-rules
            emit-value
            map-options
            options-dense
            dense
            outlined
            color="primary"
        />
    </BaseFormItem>
</template>
