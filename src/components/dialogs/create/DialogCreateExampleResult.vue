<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import type { ExampleResultType } from '@/models/ExampleResult'
import ExampleResultService from '@/services/ExampleResultService'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'
import DialogConfirm from '../DialogConfirm.vue'
import FormListCreateExampleResult from './forms/FormListCreateExampleResult.vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel, onDialogOK } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})

async function createExampleResultSubmit() {
    const recordDeepCopy = extend(true, {}, selectedStore.exampleResult) as ExampleResultType

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Create Example Result',
            message: 'Are you sure you want to create this Example Result?',
            color: 'positive',
            icon: saveIcon,
            useConfirmationCode: 'NEVER',
        },
    }).onOk(async () => {
        try {
            $q.loading.show()
            await ExampleResultService.add(recordDeepCopy)
            log.info('Example created', recordDeepCopy)
        } catch (error) {
            log.error(`Error creating Example Result`, error as Error)
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
            <q-toolbar-title>Create Example Result</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            @submit.prevent="createExampleResultSubmit"
                            @validation-error="selectedStore.isExampleResultValid = false"
                            @validation-success="selectedStore.isExampleResultValid = true"
                            class="q-mb-xl"
                        >
                            <FormListCreateExampleResult />
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
