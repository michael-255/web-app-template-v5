<script setup lang="ts">
import { LimitEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { textAreaSchema } from '@/shared/schemas'
import type { TextAreaType } from '@/shared/types'
import BaseFormItem from './BaseFormItem.vue'

const props = defineProps<{
    isDisabled: boolean
    selectedNote: TextAreaType
}>()

const emit = defineEmits(['update:selectedNote'])

const handleInput = (event: Event) => {
    const target = event.target as HTMLInputElement
    emit('update:selectedNote', target.value)
}

const handleBlur = () => {
    emit('update:selectedNote', props.selectedNote.trim())
}

const handleClear = () => {
    emit('update:selectedNote', '')
}
</script>

<template>
    <BaseFormItem label="Note" description="Optional note for this record.">
        <q-input
            @blur="handleBlur"
            @input="handleInput"
            :modelValue="selectedNote"
            :rules="[
                (val: string) =>
                    textAreaSchema.safeParse(val).success ||
                    `Note cannot exceed ${LimitEnum.MAX_TEXT_AREA} characters`,
            ]"
            :maxlength="LimitEnum.MAX_TEXT_AREA"
            :disable="isDisabled"
            type="textarea"
            lazy-rules
            autogrow
            counter
            dense
            outlined
            color="primary"
        >
            <template v-slot:append>
                <q-icon
                    v-if="selectedNote !== ''"
                    @click="handleClear"
                    class="cursor-pointer"
                    :name="cancelIcon"
                />
            </template>
        </q-input>
    </BaseFormItem>
</template>
