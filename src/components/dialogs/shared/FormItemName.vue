<script setup lang="ts">
import { LimitEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { nameSchema } from '@/shared/schemas'
import type { NameType } from '@/shared/types'
import BaseFormItem from './BaseFormItem.vue'

const props = defineProps<{
    label?: string
    description?: string
    isDisabled: boolean
    selectedName: NameType
}>()

const emit = defineEmits<{
    (event: 'update:selectedName', name: NameType): void
}>()

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:selectedName', target.value)
}

const handleBlur = () => {
    emit('update:selectedName', props.selectedName.trim())
}

const handleClear = () => {
    emit('update:selectedName', '')
}
</script>

<template>
    <BaseFormItem
        :label="label || 'Name'"
        :description="description || 'Customizable name for this record.'"
    >
        <q-input
            @blur="handleBlur"
            @input="handleInput"
            :modelValue="selectedName"
            :rules="[
                (val: string) =>
                    nameSchema.safeParse(val).success ||
                    `Name must be between ${LimitEnum.MIN_NAME} and ${LimitEnum.MAX_NAME} characters`,
            ]"
            :maxlength="LimitEnum.MAX_NAME"
            :disable="isDisabled"
            type="text"
            lazy-rules
            counter
            dense
            outlined
            color="primary"
        >
            <template v-slot:append>
                <q-icon
                    v-if="selectedName !== ''"
                    @click="handleClear"
                    class="cursor-pointer"
                    :name="cancelIcon"
                />
            </template>
        </q-input>
    </BaseFormItem>
</template>
