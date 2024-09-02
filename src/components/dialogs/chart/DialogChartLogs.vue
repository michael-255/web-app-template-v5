<script setup lang="ts">
import { DurationMSEnum } from '@/shared/enums'
import { closeIcon, createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import {
    BarElement,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { enUS } from 'date-fns/locale'
import { colors, useDialogPluginComponent } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { Bar, Line } from 'vue-chartjs'

// Register ChartJS plugins and components
ChartJS.register(
    zoomPlugin,
    Title,
    Tooltip,
    Legend,
    PointElement,
    LineElement,
    LinearScale,
    BarElement,
    TimeScale,
)

const chartRef1 = ref<any>(null)
const chartRef2 = ref<any>(null)

// Setup chart data fields and options
const chartData: Ref<any> = ref({
    datasets: [],
})
const chartOptions: ChartOptions<'bar'> = {
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
    },
    interaction: {
        intersect: false, // Tooltip triggers when mouse/figger position is near an item
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'year',
            },
            adapters: {
                date: {
                    locale: enUS,
                },
            },
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
}
const chartOptionsLine: ChartOptions<'line'> = {
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
    },
    interaction: {
        intersect: false, // Tooltip triggers when mouse/figger position is near an item
    },
    scales: {
        x: {
            type: 'time',
            time: {
                unit: 'month',
            },
            adapters: {
                date: {
                    locale: enUS,
                },
            },
            stacked: true,
        },
        y: {
            stacked: true,
        },
    },
}

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
const selectedStore = useSelectedStore()
buildDataSets()

onUnmounted(() => {
    selectedStore.$reset()
})

function refreshChart() {
    if (chartRef1.value?.chart && chartRef2.value?.chart) {
        console.log('Refreshing chart...')
        // chartRef.value.chart.reset() // Reset the chart to its initial state
        // chartRef.value.chart.update() // Update the chart to re-render it
        // chartRef.value.chart.render() // Force a re-render
        // chartRef.value.chart.resize() // Resize the chart if needed
        buildDataSets() // Rebuild datasets
    }
}

function createDataset(label: string, color: string, count: number, time: number = Date.now()) {
    const dataset: Record<string, any> = {
        label,
        backgroundColor: colors.getPaletteColor(color),
        data: [],
    }

    for (let i = 0; i < count; i++) {
        const days = Math.floor(Math.random() * 50) + 1
        time -= DurationMSEnum['One Day'] * days
        dataset.data.push({ x: time, y: Math.floor(Math.random() * 5) })
    }

    return dataset
}

/**
 * @todo
 * - To make a chart of logs per day, you need a sum of each log type per day.
 * - Only saved logs are available for charting (INFO, WARN, ERROR).
 * - Charts will by of type: time.
 * - You should limit the amount of data you look at based on the unit you choose (day, month, etc).
 */
function buildDataSets() {
    const infoDataset = createDataset('Info', 'primary', 150)
    const warnDataset = createDataset('Warning', 'warning', 30)
    const errorDataset = createDataset('Error', 'negative', 10)

    console.log('Datasets:', [infoDataset, warnDataset, errorDataset])

    chartData.value = {
        datasets: [infoDataset, warnDataset, errorDataset],
    }
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
            <q-toolbar-title>Logs Chart</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row q-gutter-sm">
                    <q-btn
                        class="col"
                        label="Refresh Zoom"
                        color="positive"
                        @click="refreshChart()"
                    />
                </div>
            </q-card-section>

            <q-card-section>
                <Bar
                    ref="chartRef1"
                    :options="chartOptions"
                    :data="chartData"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />
            </q-card-section>

            <q-card-section>
                <Line
                    ref="chartRef2"
                    :options="chartOptionsLine"
                    :data="chartData"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />
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
