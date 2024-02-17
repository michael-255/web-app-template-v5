<script setup lang="ts">
import type ExampleConfig from '@/models/ExampleConfig'
import { closeIcon, inspectIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import ArrayItem from './q-items/ArrayItem.vue'
import BooleanItem from './q-items/BooleanItem.vue'
import DateItem from './q-items/DateItem.vue'
import DefaultItem from './q-items/DefaultItem.vue'

defineProps<{
    exampleConfig: ExampleConfig
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
            <q-toolbar-title>Inspect Example Config</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogOK" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list padding>
                            <DefaultItem name="Id" :value="exampleConfig.id" />
                            <DateItem name="Created Date" :value="exampleConfig.createdAt" />
                            <DefaultItem name="Name" :value="exampleConfig.name" />
                            <DefaultItem name="Description" :value="exampleConfig.desc" />
                            <ArrayItem name="Tags" :value="exampleConfig.tags" />
                            <BooleanItem name="Activated" :value="exampleConfig.activated" />
                            <BooleanItem name="Favorited" :value="exampleConfig.favorited" />
                            <BooleanItem name="Enabled" :value="exampleConfig.enabled" />
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
