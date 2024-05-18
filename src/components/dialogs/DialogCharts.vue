<script setup lang="ts">
import { calendarIcon, chartsIcon, closeIcon } from '@/shared/icons'
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const model = ref('')
const options = [
    { label: '1 Month', value: 1 },
    { label: '3 Months', value: 3 },
    { label: '6 Months', value: 6 },
    { label: '1 Year', value: 12 },
    { label: '2 Years', value: 24 },
    { label: '3 Years', value: 36 },
    { label: '5 Years', value: 60 },
]
const today = new Date()
const threeMonthsAgo = new Date()
threeMonthsAgo.setMonth(today.getMonth() - 3)

const chartRange = ref({
    from: threeMonthsAgo.toISOString().split('T')[0],
    to: today.toISOString().split('T')[0],
})

function print() {
    console.log('Date Range:', chartRange.value)
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
            <q-icon :name="chartsIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row q-gutter-sm">
                    <q-btn :icon="calendarIcon" label="Date Range" color="primary" class="col">
                        <q-popup-proxy>
                            <q-date v-model="chartRange" range mask="YYYY-MM-DD">
                                <q-btn
                                    label="Print"
                                    color="warning"
                                    flat
                                    class="full-width"
                                    @click="print"
                                />

                                <q-btn label="Close" flat class="full-width" v-close-popup />
                            </q-date>
                        </q-popup-proxy>
                    </q-btn>

                    <q-select
                        v-model="model"
                        :options="options"
                        dense
                        outlined
                        label="Ranges"
                        class="col"
                    />
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
