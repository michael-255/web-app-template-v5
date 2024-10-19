<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import { StatusEnum } from '@/shared/enums'
import { computedStatusToggle } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.record.status.includes(StatusEnum.LOCKED),
)
// LOCKED status is handled by the app and is not user-editable
const deactivated = computedStatusToggle(selectedStore.record.status, StatusEnum.DEACTIVATED)
const favorited = computedStatusToggle(selectedStore.record.status, StatusEnum.FAVORITED)
</script>

<template>
    <BaseFormItem
        label="Status"
        description="Options that determine how the app treats this record in certain circumstances."
    >
        <q-item-label>
            <q-list padding>
                <q-item :disable="isDisabled" tag="label">
                    <q-item-section top>
                        <q-item-label>Deactivated</q-item-label>
                        <q-item-label caption>
                            Record is deactivated and not selectable.
                        </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle :disable="isDisabled" v-model="deactivated" size="lg" />
                    </q-item-section>
                </q-item>

                <q-item :disable="isDisabled" tag="label">
                    <q-item-section top>
                        <q-item-label>Favorited</q-item-label>
                        <q-item-label caption> Record is given priority sorting. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle :disable="isDisabled" v-model="favorited" size="lg" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-item-label>
    </BaseFormItem>
</template>
