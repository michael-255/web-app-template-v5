<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import useLogger from '@/composables/useLogger'
import { StatusEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref, type Ref } from 'vue'

const props = defineProps<{
    service: any
}>()

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.record.status.includes(StatusEnum.LOCKED),
)
const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        // Get Parent record options for the child record to select
        options.value = await props.service.getSelectOptions()
        // Check if the selected parentId is in the options
        const parentIdMatch = options.value.some((i) => i.value === selectedStore.record.parentId)

        if (!parentIdMatch) {
            selectedStore.record.parentId = undefined! // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading Parent Example Id options', error as Error)
    }
})
</script>

<template>
    <BaseFormItem
        label="Parent Example Id"
        description="Id of the parent record that this child record is associated with."
    >
        <q-item-label caption>
            <q-select
                v-model="selectedStore.record.parentId"
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
        </q-item-label>
    </BaseFormItem>
</template>
