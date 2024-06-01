<script setup lang="ts">
import { chartsIcon, closeIcon } from '@/shared/icons'
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
            position: 'top',
            align: 'center',
            title: {
                display: true,
                text: 'Legend',
            },
        },
        // tooltip: {
        //     callbacks: {
        //         title: (tooltipItem: any) => tooltipItem?.[0]?.label ?? '',
        //     },
        // },
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

function refreshChart() {
    const chart = ChartJS.getChart('chart-instance')
    console.log('chart', chart)
    console.log('chartData', chartOptions.plugins?.zoom)
    chart?.resetZoom() // Will need this!
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
                    <q-btn class="col" label="Month" color="primary" />
                    <q-btn class="col" label="Year" color="primary" />
                    <q-btn class="col" label="Refresh" color="positive" @click="refreshChart()" />
                </div>
            </q-card-section>

            <q-card-section>
                <Line
                    id="chart-instance"
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
