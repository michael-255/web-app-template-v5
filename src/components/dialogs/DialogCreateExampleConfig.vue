<script setup lang="ts">
import { closeIcon, createIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'

defineEmits([...useDialogPluginComponent.emits])

const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent()
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white" style="max-height: 50px">
            <q-icon :name="createIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Create Example Config</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <q-item>
                                <q-item-section>
                                    <q-item-label>Create</q-item-label>
                                    <q-item-label caption> TEST </q-item-label>
                                </q-item-section>
                            </q-item>
                        </q-list>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
