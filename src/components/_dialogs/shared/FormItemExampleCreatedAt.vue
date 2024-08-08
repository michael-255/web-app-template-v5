<script setup lang="ts">
import { calendarCheckIcon, calendarIcon, scheduleTimeIcon } from '@/shared/icons'
import type { TimestampType } from '@/shared/types'
import { date } from 'quasar'
import { computed, ref, watch } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const props = defineProps<{
    isDisabled: boolean
    selectedCreatedAt: TimestampType
}>()

const emit = defineEmits(['update:selectedCreatedAt'])

const localCreatedAt = ref(props.selectedCreatedAt)

const displayDate = computed(
    () => date.formatDate(localCreatedAt.value, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')

function onNow() {
    const now = Date.now()
    localCreatedAt.value = now
    emit('update:selectedCreatedAt', now)
}

watch(
    () => props.selectedCreatedAt,
    (newTimestamp) => {
        localCreatedAt.value = newTimestamp
        dateTimePicker.value = date.formatDate(localCreatedAt.value, 'ddd MMM DD YYYY HH:mm:00')
    },
)

watch(dateTimePicker, () => {
    const newTimestamp = new Date(dateTimePicker.value).getTime()
    localCreatedAt.value = newTimestamp
    emit('update:selectedCreatedAt', newTimestamp)
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
                @click="onNow"
            />
        </q-item-label>
    </BaseFormItem>
</template>
