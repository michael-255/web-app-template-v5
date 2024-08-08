<script setup lang="ts">
import { LimitEnum, TagEnum } from '@/shared/enums'
import {
    calendarCheckIcon,
    calendarIcon,
    cancelIcon,
    saveIcon,
    scheduleTimeIcon,
} from '@/shared/icons'
import { nameSchema, textAreaSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, ref, watch } from 'vue'
import BaseFormItem from '../BaseFormItem.vue'
import BaseSubmitButton from '../BaseSubmitButton.vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const displayDate = computed(
    () => date.formatDate(selectedStore.example.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')
const enabled = onTagToggle(TagEnum.ENABLED)
const favorited = onTagToggle(TagEnum.FAVORITED)

watch(
    () => selectedStore.example.createdAt,
    (newTimestamp) => {
        dateTimePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY HH:mm:00')
    },
)

watch(dateTimePicker, () => {
    // Timestamp is created using the formatted date and time picker values
    selectedStore.example.createdAt = new Date(dateTimePicker.value).getTime()
})

function onNow() {
    selectedStore.example.createdAt = Date.now()
}

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: TagEnum) {
    return computed({
        get: () => selectedStore.example.tags?.includes(tag),
        set: (value) => {
            if (!selectedStore.example.tags) {
                selectedStore.example.tags = []
            }
            const index = selectedStore.example.tags.indexOf(tag)
            if (value && index === -1) {
                selectedStore.example.tags.push(tag)
            } else if (!value && index !== -1) {
                selectedStore.example.tags.splice(index, 1)
            }
        },
    })
}

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.example.tags?.includes(TagEnum.LOCKED)
})
</script>

<template>
    <BaseFormItem
        label="Id"
        description="An auto generated value that uniquely identifies this record in the database."
    >
        {{ selectedStore.example.id }}
    </BaseFormItem>

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

    <BaseFormItem label="Name" description="Customizable name for this record.">
        <q-input
            :disable="isDisabled"
            v-model="selectedStore.example.name"
            :rules="[
                (val: string) =>
                    nameSchema.safeParse(val).success ||
                    `Name must be between ${LimitEnum.MIN_NAME} and ${LimitEnum.MAX_NAME} characters`,
            ]"
            :maxlength="LimitEnum.MAX_NAME"
            type="text"
            lazy-rules
            counter
            dense
            outlined
            color="primary"
            @blur="selectedStore.example.name = selectedStore.example.name?.trim()"
        >
            <template v-slot:append>
                <q-icon
                    v-if="selectedStore.example.name !== ''"
                    @click="selectedStore.example.name = ''"
                    class="cursor-pointer"
                    :name="cancelIcon"
                />
            </template>
        </q-input>
    </BaseFormItem>

    <BaseFormItem label="Description" description="Optional description for this record.">
        <q-input
            :disable="isDisabled"
            v-model="selectedStore.example.desc"
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
            @blur="selectedStore.example.desc = selectedStore.example.desc?.trim()"
        >
            <template v-slot:append>
                <q-icon
                    v-if="selectedStore.example.desc !== ''"
                    @click="selectedStore.example.desc = ''"
                    class="cursor-pointer"
                    :name="cancelIcon"
                />
            </template>
        </q-input>
    </BaseFormItem>

    <BaseFormItem
        label="Tags"
        description="Options that determine how the app treats this record in certain circumstances."
    >
        <q-list padding>
            <q-item :disable="isDisabled" tag="label">
                <q-item-section top>
                    <q-item-label>Enabled</q-item-label>
                    <q-item-label caption> Record is active and visible. </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle :disable="isDisabled" v-model="enabled" size="lg" />
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
    </BaseFormItem>

    <BaseSubmitButton>
        <template v-slot:button>
            <q-btn
                label="Create Example"
                :icon="saveIcon"
                :disable="isDisabled"
                color="positive"
                type="submit"
            />
        </template>

        <template v-slot:warning>
            <div v-show="!selectedStore.isExampleValid" class="row justify-center text-warning">
                Correct invalid entries and try again
            </div>
        </template>
    </BaseSubmitButton>
</template>
