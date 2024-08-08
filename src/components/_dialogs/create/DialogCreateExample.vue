<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import DB from '@/services/db'
import { LimitEnum, SettingKeyEnum, TagEnum } from '@/shared/enums'
import {
    calendarCheckIcon,
    calendarIcon,
    cancelIcon,
    closeIcon,
    createIcon,
    saveIcon,
    scheduleTimeIcon,
} from '@/shared/icons'
import { nameSchema, textAreaSchema } from '@/shared/schemas'
import type { ExampleType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { date, extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onUnmounted, ref, watch } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger(DB)
const { onConfirmDialog } = useDialogs(DB)
const settingsStore = useSettingsStore()
const selectedStore = useSelectedStore()

const displayDate = computed(
    () => date.formatDate(selectedStore.example.createdAt, 'ddd, YYYY MMM Do, h:mm A') ?? '-',
)
const dateTimePicker = ref('')
const enabled = onTagToggle(TagEnum.ENABLED)
const favorited = onTagToggle(TagEnum.FAVORITED)

onUnmounted(() => {
    selectedStore.$reset()
})

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

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.example.tags?.includes(TagEnum.LOCKED)
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

async function onCreateSubmit() {
    if (settingsStore.getSettingValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await createSubmit()
    } else {
        onConfirmDialog({
            title: 'Create Example',
            message: 'Are you sure you want to create this Example?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await createSubmit()
            },
        })
    }
}

async function createSubmit() {
    try {
        $q.loading.show()
        const example = extend(true, {}, selectedStore.example) as ExampleType
        // await service.add(DB, newRecord)
        log.info('Example created', example)
    } catch (error) {
        log.error(`Error creating Example`, error as Error)
    } finally {
        $q.loading.hide()
        onDialogOK()
    }
}
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="createIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Create Example</q-toolbar-title>
            <q-btn
                flat
                round
                :icon="closeIcon"
                :disable="$q.loading.isActive"
                @click="onDialogCancel"
            />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="onCreateSubmit"
                            @validation-error="selectedStore.isExampleValid = false"
                            @validation-success="selectedStore.isExampleValid = true"
                            class="q-mb-xl"
                        >
                            <q-list padding>
                                <BaseFormItem
                                    label="Id"
                                    description="An auto generated value that uniquely identifies this record in the database."
                                >
                                    {{ selectedStore.example.id }}
                                </BaseFormItem>

                                <BaseFormItem
                                    label="Created Date"
                                    description="Date and time this record was created."
                                >
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
                                                    <q-btn
                                                        label="Close"
                                                        flat
                                                        class="full-width"
                                                        v-close-popup
                                                    />
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
                                                <q-time
                                                    v-model="dateTimePicker"
                                                    mask="ddd MMM DD YYYY HH:mm:00"
                                                    now-btn
                                                >
                                                    <q-btn
                                                        label="Close"
                                                        flat
                                                        class="full-width"
                                                        v-close-popup
                                                    />
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

                                <BaseFormItem
                                    label="Name"
                                    description="Customizable name for this record."
                                >
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
                                        @blur="
                                            selectedStore.example.name =
                                                selectedStore.example.name?.trim()
                                        "
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

                                <BaseFormItem
                                    label="Description"
                                    description="Optional description for this record."
                                >
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
                                        @blur="
                                            selectedStore.example.desc =
                                                selectedStore.example.desc?.trim()
                                        "
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
                                                <q-item-label caption>
                                                    Record is active and visible.
                                                </q-item-label>
                                            </q-item-section>

                                            <q-item-section side>
                                                <q-toggle
                                                    :disable="isDisabled"
                                                    v-model="enabled"
                                                    size="lg"
                                                />
                                            </q-item-section>
                                        </q-item>

                                        <q-item :disable="isDisabled" tag="label">
                                            <q-item-section top>
                                                <q-item-label>Favorited</q-item-label>
                                                <q-item-label caption>
                                                    Record is given priority sorting.
                                                </q-item-label>
                                            </q-item-section>

                                            <q-item-section side>
                                                <q-toggle
                                                    :disable="isDisabled"
                                                    v-model="favorited"
                                                    size="lg"
                                                />
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
                                        <div
                                            v-show="!selectedStore.isExampleValid"
                                            class="row justify-center text-warning"
                                        >
                                            Correct invalid entries and try again
                                        </div>
                                    </template>
                                </BaseSubmitButton>
                            </q-list>
                        </q-form>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.toolbar-height {
    max-height: 50px;
}
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
