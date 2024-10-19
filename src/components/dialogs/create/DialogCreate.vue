<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import { SettingKeyEnum } from '@/models/Setting'
import { StatusEnum } from '@/shared/enums'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, onMounted, onUnmounted, ref, type DefineComponent } from 'vue'

const props = defineProps<{
    labelSingular: string
    initialRecord: Record<string, any>
    createMethod: (record: Record<string, any>) => Promise<Record<string, any>>
    formComponents: DefineComponent[]
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const settingsStore = useSettingsStore()
const selectedStore = useSelectedStore()

const isFormValid = ref(true)

const isDisabled = computed(
    () => $q.loading.isActive || props.initialRecord.status.includes(StatusEnum.LOCKED),
)

onMounted(() => {
    selectedStore.record = props.initialRecord
})

onUnmounted(() => {
    selectedStore.$reset()
})

async function onSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.record) as Record<string, any>

    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await submitCreate(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: `Create ${props.labelSingular}`,
            message: `Are you sure you want to create this ${props.labelSingular}?`,
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await submitCreate(recordDeepCopy)
            },
        })
    }
}

async function submitCreate(record: Record<string, any>) {
    try {
        $q.loading.show()
        await props.createMethod(record)
        log.info(`${props.labelSingular} created`, record)
    } catch (error) {
        log.error(`Error creating ${props.labelSingular}`, error as Error)
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
            <q-toolbar-title>Create {{ labelSingular }}</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="onSubmit"
                            @validation-error="isFormValid = false"
                            @validation-success="isFormValid = true"
                            class="q-mb-xl"
                        >
                            <q-list padding>
                                <component
                                    v-for="(formComponent, index) in props.formComponents"
                                    :key="index"
                                    :is="formComponent.component"
                                    v-bind="formComponent.props"
                                />

                                <q-item>
                                    <q-item-section>
                                        <q-item-label>
                                            <div class="row justify-center">
                                                <q-btn
                                                    :label="`Create ${props.labelSingular}`"
                                                    :icon="saveIcon"
                                                    :disable="isDisabled"
                                                    color="positive"
                                                    type="submit"
                                                />
                                            </div>
                                        </q-item-label>
                                    </q-item-section>
                                </q-item>

                                <q-item v-show="!isFormValid">
                                    <q-item-section>
                                        <div class="row justify-center text-warning">
                                            Correct invalid form entries and try again
                                        </div>
                                    </q-item-section>
                                </q-item>
                            </q-list>
                        </q-form>
                        <div class="q-mt-xl" />
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
