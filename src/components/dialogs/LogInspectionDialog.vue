<script setup lang="ts">
import { Log } from '@/models'
import { Icon } from '@/shared'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    log: Log
}>()

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
            <q-icon :name="Icon.inspect" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect Log</q-toolbar-title>
            <q-btn flat round :icon="Icon.close" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <p class="text-h5">TITLE</p>
                <div>{{ log }}</div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
