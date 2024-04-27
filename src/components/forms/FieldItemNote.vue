<script setup lang="ts">
import { LimitEnum, SettingIdEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { textAreaSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'

const selectedStore = useSelectedStore()
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
                    v-model="selectedStore.record.note"
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
                    @blur="selectedStore.record.note = selectedStore.record.note?.trim()"
                >
                    <template v-slot:append>
                        <q-icon
                            v-if="selectedStore.record.note !== ''"
                            @click="selectedStore.record.note = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
