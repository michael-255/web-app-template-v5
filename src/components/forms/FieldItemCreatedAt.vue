<script setup lang="ts">
import { SettingIdEnum, TagEnum } from '@/shared/enums'
import { calendarCheckIcon, calendarIcon, scheduleTimeIcon } from '@/shared/icons'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'

const $q = useQuasar()
const formStore = useFormStore()
const settingsStore = useSettingsStore()

const displayDate = computed(
    () => date.formatDate(formStore.record.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')

watch(
    () => formStore.record.createdAt,
    (newTimestamp) => {
        dateTimePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY HH:mm:00')
    },
)

watch(dateTimePicker, () => {
    // Timestamp is created using the formatted date and time picker values
    formStore.record.createdAt = new Date(dateTimePicker.value).getTime()
})

function onNow() {
    formStore.record.createdAt = Date.now()
}

const isDisabled = computed(() => {
    return $q.loading.isActive || formStore.record?.tags?.includes(TagEnum.LOCKED)
})
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
        </q-item-section>
    </q-item>
</template>
