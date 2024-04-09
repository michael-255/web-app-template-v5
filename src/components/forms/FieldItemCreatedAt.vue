<script setup lang="ts">
import { calendarTodayIcon, scheduleTimeIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { date } from 'quasar'
import { computed, ref, watch } from 'vue'

const selectedStore = useSelectedStore()

const displayDate = computed(() =>
    date.formatDate(selectedStore.record.createdAt, 'ddd, YYYY MMM Do, h:mm A'),
)
const datePicker = ref('')
const timePicker = ref('')

watch(
    () => selectedStore.record.createdAt,
    (newTimestamp) => {
        datePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY')
        timePicker.value = date.formatDate(newTimestamp, 'HH:mm:00')
    },
)

watch([datePicker, timePicker], () => {
    // Timestamp is created using the formatted date and time picker values
    selectedStore.record.createdAt = new Date(`${datePicker.value} ${timePicker.value}`).getTime()
})
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Created Date</q-item-label>

            <q-item-label>Date and time the record was created.</q-item-label>

            <q-item-label class="text-h6">{{ displayDate }}</q-item-label>

            <q-item-label caption>
                <q-btn :icon="calendarTodayIcon" color="primary" class="q-px-sm">
                    <q-popup-proxy>
                        <q-date v-model="datePicker" mask="ddd MMM DD YYYY" today-btn no-unset>
                            <q-btn label="OK" color="primary" class="full-width" v-close-popup />
                        </q-date>
                    </q-popup-proxy>
                </q-btn>

                <q-btn :icon="scheduleTimeIcon" color="primary" class="q-ml-sm q-px-sm">
                    <q-popup-proxy>
                        <q-time v-model="timePicker" mask="HH:mm:00" now-btn>
                            <q-btn label="OK" color="primary" class="full-width" v-close-popup />
                        </q-time>
                    </q-popup-proxy>
                </q-btn>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
