<script setup lang="ts">
import { TagEnum } from '@/shared/enums'
import { calendarCheckIcon, calendarIcon, scheduleTimeIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const displayDate = computed(
    () => date.formatDate(selectedStore.exampleResult.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')

watch(
    () => selectedStore.exampleResult.createdAt,
    (newTimestamp) => {
        dateTimePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY HH:mm:00')
    },
)

watch(dateTimePicker, () => {
    // Timestamp is created using the formatted date and time picker values
    selectedStore.exampleResult.createdAt = new Date(dateTimePicker.value).getTime()
})

function onNow() {
    selectedStore.exampleResult.createdAt = Date.now()
}

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.exampleResult.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <BaseFormItem label="Created Date" description="Date and time this record was created.">
        <q-item-label class="text-h6">{{ displayDate }}</q-item-label>

        <q-item-label class="q-gutter-xs">
            <q-btn
                :disable="isDisabled"
                :icon="calendarIcon"
                size="sm"
                label="Date"
                color="primary"
            >
                <q-popup-proxy>
                    <q-date
                        v-model="dateTimePicker"
                        mask="ddd MMM DD YYYY HH:mm:00"
                        today-btn
                        no-unset
                    >
                        <q-btn label="Close" flat class="full-width" v-close-popup />
                    </q-date>
                </q-popup-proxy>
            </q-btn>

            <q-btn
                :disable="isDisabled"
                :icon="scheduleTimeIcon"
                size="sm"
                label="Time"
                color="primary"
            >
                <q-popup-proxy>
                    <q-time v-model="dateTimePicker" mask="ddd MMM DD YYYY HH:mm:00" now-btn>
                        <q-btn label="Close" flat class="full-width" v-close-popup />
                    </q-time>
                </q-popup-proxy>
            </q-btn>

            <q-btn
                :disable="isDisabled"
                :icon="calendarCheckIcon"
                size="sm"
                label="Now"
                color="positive"
                @click="onNow()"
            />
        </q-item-label>
    </BaseFormItem>
</template>
