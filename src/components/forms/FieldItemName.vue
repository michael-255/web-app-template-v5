<script setup lang="ts">
import { LimitEnum, SettingIdEnum, TagEnum } from '@/shared/enums'
import { nameSchema } from '@/shared/schemas'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const formStore = useFormStore()
const settingsStore = useSettingsStore()

const isDisabled = computed(() => {
    return $q.loading.isActive || formStore.record?.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Name</q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                Customizable name for this record.
            </q-item-label>

            <q-item-label caption>
                <q-input
                    :disable="isDisabled"
                    v-model="formStore.record.name"
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
                    @blur="formStore.record.name = formStore.record.name?.trim()"
                />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
