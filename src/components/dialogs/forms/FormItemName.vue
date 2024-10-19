<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import { LimitEnum, StatusEnum } from '@/shared/enums'
import { cancelIcon } from '@/shared/icons'
import { textLineSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.record.status.includes(StatusEnum.LOCKED),
)
</script>

<template>
    <BaseFormItem label="Name" description="Customizable name for this record.">
        <q-item-label>
            <q-input
                v-model="selectedStore.record.name"
                @blur="selectedStore.record.name = selectedStore.record.name?.trim()"
                :rules="[
                    (val: string) =>
                        textLineSchema.safeParse(val).success ||
                        `Name must be between ${LimitEnum.MIN_TEXT_LINE} and ${LimitEnum.MAX_TEXT_LINE} characters`,
                ]"
                :maxlength="LimitEnum.MAX_TEXT_LINE"
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
                        v-if="selectedStore.record.name !== ''"
                        @click="selectedStore.record.name = ''"
                        class="cursor-pointer"
                        :name="cancelIcon"
                    />
                </template>
            </q-input>
        </q-item-label>
    </BaseFormItem>
</template>
