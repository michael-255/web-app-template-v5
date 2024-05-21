<script setup lang="ts">
import { calendarIcon, chartsIcon, closeIcon } from '@/shared/icons'
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LineElement,
    LinearScale,
    PointElement,
    Title,
    Tooltip,
    type ChartOptions,
} from 'chart.js'
import zoomPlugin from 'chartjs-plugin-zoom'
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(
    zoomPlugin,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    CategoryScale,
    LinearScale,
)
const chartData = {
    labels: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ],
    datasets: [
        {
            label: 'Data One',
            backgroundColor: 'white',
            borderColor: '#1976d2',
            data: [40, 20, 12, 39, 10, 40, 39, 60, 40, 20, 12, 11],
        },
        {
            label: 'Data Two',
            backgroundColor: 'white',
            borderColor: '#607d8b',
            data: [20, 40, 32, 19, 40, 39, 80, 40, 20, 40, 39, 40],
        },
        {
            label: 'Data Three',
            backgroundColor: 'white',
            borderColor: '#673ab7',
            data: [40, 39, 80, 40, 20, 45, 60, 40, 20, 12, 11, 40],
        },
        {
            label: 'Data Four',
            backgroundColor: 'white',
            borderColor: '#ff6f00',
            data: [400, 200, 120, 390, 100, 400, 390, 600, 400, 200, 120, 110],
        },
        {
            label: 'Data Five',
            backgroundColor: 'white',
            borderColor: '#C10015',
            data: [0.05, 0.02, 0.12, 0.39, 0.1, 0.4, 0.39, 0.6, 0.4, 0.2, 0.12, 0.11],
        },
    ],
}
const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
        legend: {
            display: true,
        },
        tooltip: {
            callbacks: {
                title: (tooltipItem: any) => tooltipItem?.[0]?.label ?? '',
            },
        },
        zoom: {
            pan: {
                enabled: true,
                mode: 'xy',
            },
            zoom: {
                wheel: {
                    enabled: true,
                },
                pinch: {
                    enabled: true,
                },
                mode: 'xy',
            },
            limits: {
                x: {
                    min: 0,
                    max: 12,
                },
                y: {
                    min: 0,
                    max: 600,
                },
            },
        },
    },
    interaction: {
        intersect: false,
    },
    scales: {
        x: {
            ticks: {
                autoSkip: true,
                maxRotation: 70,
                minRotation: 70,
            },
        },
    },
}

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

            <q-card-section>
                <Line
                    id="my-chart-id"
                    :options="chartOptions"
                    :data="chartData"
                    style="max-height: 500px"
                />
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
