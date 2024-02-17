<script setup lang="ts">
import DateItem from '@/components/dialogs/inspect-items/DateItem.vue'
import DefaultItem from '@/components/dialogs/inspect-items/DefaultItem.vue'
import ObjectItem from '@/components/dialogs/inspect-items/ObjectItem.vue'
import Log from '@/models/Log'
import { closeIcon, inspectIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'

defineProps<{
    model: Log
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
            <q-icon :name="inspectIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect Log</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <DefaultItem name="Auto Id" :value="model.autoId" />
                            <DateItem name="Created Date" :value="model.createdAt" />
                            <DefaultItem name="Log Level" :value="model.logLevel" />
                            <DefaultItem name="Label" :value="model.label" />
                            <ObjectItem name="Details" :value="model.details" />
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
