<script setup lang="ts">
import { calendarCheckIcon, calendarTodayIcon, scheduleTimeIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { date } from 'quasar'
import { onMounted, ref, type Ref } from 'vue'

const selectedStore = useSelectedStore()

const existingTime: Ref<number | undefined> = ref(undefined)
const displayDate = ref('')
const datePicker = ref('')
const timePicker = ref('')

onMounted(async () => {
    existingTime.value = selectedStore.record.createdAt ?? Date.now()
    datePicker.value = date.formatDate(existingTime.value, 'ddd MMM DD YYYY')
    timePicker.value = date.formatDate(existingTime.value, 'HH:mm:00')
    updateDisplayDate(existingTime.value)
})

function updateDisplayDate(timestamp: number = Date.now()) {
    selectedStore.record.createdAt = timestamp
    displayDate.value = date.formatDate(timestamp, 'ddd, YYYY MMM Do, h:mm A')
}

function onPickerUpdate() {
    // Set empty pickers with current time
    datePicker.value = datePicker.value
        ? datePicker.value
        : date.formatDate(Date.now(), 'ddd MMM DD YYYY')
    timePicker.value = timePicker.value ? timePicker.value : date.formatDate(Date.now(), 'HH:mm:00')

    const dateTimestamp = new Date(`${datePicker.value} ${timePicker.value}`).getTime()
    updateDisplayDate(dateTimestamp)
}
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Created Date</q-item-label>

            <q-item-label>Date and time the record was created.</q-item-label>

            <q-item-label caption>
                <q-input
                    v-model="displayDate"
                    dense
                    outlined
                    disable
                    color="primary"
                    hint="Auto formatted"
                >
                    <template v-slot:after>
                        <!-- Date Picker -->
                        <q-btn :icon="calendarTodayIcon" color="primary" class="q-px-sm">
                            <q-popup-proxy>
                                <q-date v-model="datePicker" mask="ddd MMM DD YYYY">
                                    <div class="row items-center justify-end q-gutter-sm">
                                        <q-btn label="Cancel" flat v-close-popup />
                                        <q-btn
                                            label="OK"
                                            color="primary"
                                            flat
                                            @click="onPickerUpdate()"
                                            v-close-popup
                                        />
                                    </div>
                                </q-date>
                            </q-popup-proxy>
                        </q-btn>

                        <!-- Time Picker -->
                        <q-btn :icon="scheduleTimeIcon" color="primary" class="q-ml-sm q-px-sm">
                            <q-popup-proxy>
                                <q-time v-model="timePicker" mask="HH:mm:00" now-btn>
                                    <div class="row items-center justify-end q-gutter-sm">
                                        <q-btn label="Cancel" flat v-close-popup />
                                        <q-btn
                                            label="OK"
                                            color="primary"
                                            flat
                                            @click="onPickerUpdate()"
                                            v-close-popup
                                        />
                                    </div>
                                </q-time>
                            </q-popup-proxy>
                        </q-btn>

                        <!-- Set DateTime to now -->
                        <q-btn
                            :icon="calendarCheckIcon"
                            color="positive"
                            class="q-ml-sm q-px-sm"
                            @click="updateDisplayDate()"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
