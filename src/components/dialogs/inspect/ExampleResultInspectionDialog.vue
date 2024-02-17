<script setup lang="ts">
import type ExampleResult from '@/models/ExampleResult'
import { closeIcon, inspectIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import BooleanItem from './q-items/BooleanItem.vue'
import DateItem from './q-items/DateItem.vue'
import DefaultItem from './q-items/DefaultItem.vue'

defineProps<{
    exampleResult: ExampleResult
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
            <q-toolbar-title>Inspect Example Result</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <DefaultItem name="Id" :value="exampleResult.id" />
                            <DateItem name="Created Date" :value="exampleResult.createdAt" />
                            <DefaultItem name="Config Id" :value="exampleResult.configId" />
                            <DefaultItem name="Notes" :value="exampleResult.notes" />
                            <BooleanItem name="Activated" :value="exampleResult.activated" />
                            <BooleanItem name="Skipped" :value="exampleResult.skipped" />
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
