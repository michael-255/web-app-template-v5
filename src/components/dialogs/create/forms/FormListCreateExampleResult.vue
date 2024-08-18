<script setup lang="ts">
import BaseFormItem from '@/components/dialogs/shared/BaseFormItem.vue'
import BaseSubmitButton from '@/components/dialogs/shared/BaseSubmitButton.vue'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { ChildTagEnum, LimitEnum } from '@/shared/enums'
import { calendarCheckIcon, calendarIcon, cancelIcon, scheduleTimeIcon } from '@/shared/icons'
import { idSchema, textAreaSchema } from '@/shared/schemas'
import type { ChildTagType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { date, useQuasar } from 'quasar'
import { computed, onMounted, ref, watch, type Ref } from 'vue'

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()
const examplesService = ExamplesService()

const isDisabled = computed(
    () => $q.loading.isActive || selectedStore.exampleResult?.tags?.includes(ChildTagEnum.LOCKED),
)
const skipped = onTagToggle(ChildTagEnum.SKIPPED)
const displayDate = computed(
    () => date.formatDate(selectedStore.exampleResult.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')
const options: Ref<{ value: string; label: string; disable: boolean }[]> = ref([])

onMounted(async () => {
    try {
        options.value = await examplesService.getSelectOptions()
        const parentIdMatch = options.value.some(
            (i) => i.value === selectedStore.exampleResult.parentId,
        )

        if (!parentIdMatch) {
            selectedStore.exampleResult.parentId = undefined! // If no options, or id is invalid
        }
    } catch (error) {
        log.error('Error loading Parent Example Id options', error as Error)
    }
})

watch(
    () => selectedStore.exampleResult.createdAt,
    (newTimestamp) => {
        dateTimePicker.value = date.formatDate(newTimestamp, 'ddd MMM DD YYYY HH:mm:00')
    },
)

watch(dateTimePicker, () => {
    const newTimestamp = new Date(dateTimePicker.value).getTime()
    selectedStore.exampleResult.createdAt = newTimestamp
})

function onNow() {
    selectedStore.exampleResult.createdAt = Date.now()
}

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: ChildTagType) {
    return computed({
        get: () => selectedStore.exampleResult.tags?.includes(tag),
        set: (value) => {
            if (!selectedStore.exampleResult.tags) {
                selectedStore.exampleResult.tags = []
            }
            const index = selectedStore.exampleResult.tags.indexOf(tag)
            if (value && index === -1) {
                selectedStore.exampleResult.tags.push(tag)
            } else if (!value && index !== -1) {
                selectedStore.exampleResult.tags.splice(index, 1)
            }
        },
    })
}
</script>

<template>
    <q-list padding>
        <BaseFormItem
            label="Id"
            description="An auto generated value that uniquely identifies this record in the database."
        >
            <q-item-label caption>
                {{ selectedStore.exampleResult?.id ?? '-' }}
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem
            label="Parent Example Id"
            description="Id of the parent record that this child record is associated with."
        >
            <q-item-label caption>
                <q-select
                    v-model="selectedStore.exampleResult.parentId"
                    :rules="[(val: string) => idSchema.safeParse(val).success || 'Required']"
                    :disable="isDisabled"
                    :options="options"
                    lazy-rules
                    emit-value
                    map-options
                    options-dense
                    dense
                    outlined
                    color="primary"
                />
            </q-item-label>
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
                    @click="onNow"
                />
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem label="Note" description="Optional description for this record.">
            <q-item-label>
                <q-input
                    v-model="selectedStore.exampleResult.note"
                    @blur="
                        selectedStore.exampleResult.note = selectedStore.exampleResult.note?.trim()
                    "
                    :rules="[
                        (val: string) =>
                            textAreaSchema.safeParse(val).success ||
                            `Note cannot exceed ${LimitEnum.MAX_TEXT_AREA} characters`,
                    ]"
                    :maxlength="LimitEnum.MAX_TEXT_AREA"
                    :disable="isDisabled"
                    type="textarea"
                    lazy-rules
                    autogrow
                    counter
                    dense
                    outlined
                    color="primary"
                >
                    <template v-slot:append>
                        <q-icon
                            v-if="selectedStore.exampleResult.note !== ''"
                            @click="selectedStore.exampleResult.note = ''"
                            class="cursor-pointer"
                            :name="cancelIcon"
                        />
                    </template>
                </q-input>
            </q-item-label>
        </BaseFormItem>

        <BaseFormItem
            label="Tags"
            description="Options that determine how the app treats this record in certain circumstances."
        >
            <q-item-label>
                <q-list padding>
                    <q-item :disable="isDisabled" tag="label">
                        <q-item-section top>
                            <q-item-label>Skipped</q-item-label>
                            <q-item-label caption>
                                Record was skipped and is incomplete.
                            </q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-toggle :disable="isDisabled" v-model="skipped" size="lg" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </q-item-label>
        </BaseFormItem>

        <BaseSubmitButton
            label="Create Example"
            :isFormValid="selectedStore.isExampleValid"
            :isDisabled="isDisabled"
        />
    </q-list>
</template>
