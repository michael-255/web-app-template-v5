<script setup lang="ts">
import { LimitEnum, SettingIdEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { textAreaSchema } from '@/shared/schemas'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const formStore = useFormStore()
const settingsStore = useSettingsStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Note</q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                Optional notes associated with this record.
            </q-item-label>

            <q-item-label caption>
                <q-input
                    :disable="$q.loading.isActive"
                    v-model="formStore.record.note"
                    :rules="[
                        (val: string) =>
                            textAreaSchema.safeParse(val).success ||
                            `Note cannot exceed ${LimitEnum.MAX_TEXT_AREA} characters`,
                    ]"
                    :maxlength="LimitEnum.MAX_TEXT_AREA"
                    type="textarea"
                    lazy-rules
                    autogrow
                    counter
                    dense
                    outlined
                    color="primary"
                    @blur="formStore.record.note = formStore.record.note?.trim()"
                >
                    <template v-slot:append>
                        <q-icon
                            v-if="formStore.record.note !== ''"
                            @click="formStore.record.note = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
