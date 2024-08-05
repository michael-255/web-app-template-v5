<script setup lang="ts">
import { LimitEnum, TagEnum } from '@/shared/enums'
import { nameSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.example.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <BaseFormItem :label="'Name'" :description="'Customizable name for this record.'">
        <q-input
            :disable="isDisabled"
            v-model="selectedStore.example.name"
            :rules="[
                (val: string) =>
                    nameSchema.safeParse(val).success ||
                    `Name must be between ${LimitEnum.MIN_NAME} and ${LimitEnum.MAX_NAME} characters`,
            ]"
            :maxlength="LimitEnum.MAX_NAME"
            type="text"
            lazy-rules
            counter
            dense
            outlined
            color="primary"
            @blur="selectedStore.example.name = selectedStore.example.name?.trim()"
        />
    </BaseFormItem>
</template>
