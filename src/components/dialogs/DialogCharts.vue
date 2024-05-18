<script setup lang="ts">
import { calendarIcon, chartsIcon, closeIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const chartRange = ref({ from: '2020/07/08', to: '2020/07/17' })
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
            <q-icon :name="chartsIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                Testing Charts
                <q-btn :icon="calendarIcon" size="sm" label="Date Range" color="primary">
                    <q-popup-proxy>
                        <!-- <q-date v-model="datePicker" mask="ddd MMM DD YYYY" today-btn no-unset>
                            <q-btn label="Close" flat class="full-width" v-close-popup />
                        </q-date> -->
                        <q-date v-model="chartRange" range>
                            <q-btn label="Close" flat class="full-width" v-close-popup />
                        </q-date>
                    </q-popup-proxy>
                </q-btn>
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
