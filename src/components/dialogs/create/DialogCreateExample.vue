<script setup lang="ts">
import FormListCreateExample from '@/components/dialogs/create/forms/FormListCreateExample.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import type { ExampleType } from '@/models/Example'
import { SettingKeyEnum } from '@/models/Setting'
import ExampleService from '@/services/ExampleService'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const exampleService = ExampleService()
const selectedStore = useSelectedStore()
const settingsStore = useSettingsStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createExampleSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.example) as ExampleType
    if (settingsStore.getKeyValue(SettingKeyEnum.ADVANCED_MODE)) {
        return await createSubmit(recordDeepCopy)
    } else {
        onConfirmDialog({
            title: 'Create Example',
            message: 'Are you sure you want to create this Example?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await createSubmit(recordDeepCopy)
            },
        })
    }
}

async function createSubmit(record: ExampleType) {
    try {
        $q.loading.show()
        await exampleService.add(record)
        log.info('Example created', record)
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
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="createExampleSubmit"
                            @validation-error="selectedStore.isExampleValid = false"
                            @validation-success="selectedStore.isExampleValid = true"
                            class="q-mb-xl"
                        >
                            <FormListCreateExample />
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
