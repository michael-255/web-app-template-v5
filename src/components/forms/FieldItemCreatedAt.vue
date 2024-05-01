<script setup lang="ts">
import { SettingIdEnum } from '@/shared/enums'
import { calendarCheckIcon, calendarIcon, scheduleTimeIcon } from '@/shared/icons'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { date } from 'quasar'
import { computed, ref, watch } from 'vue'

const formStore = useFormStore()
const settingsStore = useSettingsStore()

const displayDate = computed(
    () => date.formatDate(formStore.record.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const datePicker = ref('')
const timePicker = ref('')

watch(
    () => formStore.record.createdAt,
    (newTimestamp) => {
        datePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY')
        timePicker.value = date.formatDate(newTimestamp, 'HH:mm:00')
    },
)

watch([datePicker, timePicker], () => {
    // Timestamp is created using the formatted date and time picker values
    formStore.record.createdAt = new Date(`${datePicker.value} ${timePicker.value}`).getTime()
})

function onNow() {
    formStore.record.createdAt = Date.now()
}
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Created Date</q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                Date and time this record was created.
            </q-item-label>

            <q-item-label class="text-h6">{{ displayDate }}</q-item-label>

            <q-item-label class="q-gutter-xs">
                <q-btn
                    :disable="formStore.loading"
                    :icon="calendarIcon"
                    size="sm"
                    label="Date"
                    color="primary"
                >
                    <q-popup-proxy>
                        <q-date v-model="datePicker" mask="ddd MMM DD YYYY" today-btn no-unset>
                            <q-btn label="Close" flat class="full-width" v-close-popup />
                        </q-date>
                    </q-popup-proxy>
                </q-btn>

                <q-btn
                    :disable="formStore.loading"
                    :icon="scheduleTimeIcon"
                    size="sm"
                    label="Time"
                    color="primary"
                >
                    <q-popup-proxy>
                        <q-time v-model="timePicker" mask="HH:mm:00" now-btn>
                            <q-btn label="Close" flat class="full-width" v-close-popup />
                        </q-time>
                    </q-popup-proxy>
                </q-btn>

                <q-btn
                    :disable="formStore.loading"
                    :icon="calendarCheckIcon"
                    size="sm"
                    label="Now"
                    color="positive"
                    @click="onNow()"
                />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
