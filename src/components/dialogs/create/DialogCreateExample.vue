<script setup lang="ts">
import FormListCreateExample from '@/components/dialogs/create/forms/FormListCreateExample.vue'
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import useLogger from '@/composables/useLogger'
import type { ExampleType } from '@/models/Example'
import ExampleService from '@/services/ExampleService'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createExampleSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.example) as ExampleType

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Create Example',
            message: 'Are you sure you want to create this Example?',
            color: 'positive',
            icon: saveIcon,
            useConfirmationCode: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await ExampleService.add(recordDeepCopy)
            log.info('Example created', recordDeepCopy)
        } catch (error) {
            log.error(`Error creating Example`, error as Error)
        } finally {
            $q.loading.hide()
            onDialogOK()
        }
    })
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
