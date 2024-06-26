<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { SettingIdEnum, TableEnum, TagEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'
import { computed, onMounted, ref, type Ref } from 'vue'

const props = defineProps<{
    mutation: 'Create' | 'Edit'
    table: TableEnum
}>()

const $q = useQuasar()
const { log } = useLogger()
const formStore = useFormStore()
const settingsStore = useSettingsStore()

const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])
const parentTable = DatabaseManager.getService(props.table).parentTable
const service = DatabaseManager.getService(parentTable)

onMounted(async () => {
    try {
        options.value = await service.getSelectOptions(DB)
        const parentIdMatch = options.value.some((i) => i.value === formStore.record.parentId)

        if (!parentIdMatch) {
            formStore.record.parentId = undefined // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading ParentId field', error as Error)
    }
})

const isDisabled = computed(() => {
    return $q.loading.isActive || formStore.record?.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold"> Parent {{ service.labelSingular }} Id </q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                Id of the parent record that this child record is associated with.
            </q-item-label>

            <q-item-label v-if="mutation == 'Edit'" caption class="q-mb-md">
                {{ formStore.record?.parentId ?? '-' }}
            </q-item-label>

            <q-item-label v-else caption>
                <q-select
                    :disable="isDisabled"
                    v-model="formStore.record.parentId"
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
        </q-item-section>
    </q-item>
</template>
