<script setup lang="ts">
import { DurationMSEnum } from '@/shared/enums'
import { closeIcon, createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import {
    Chart as ChartJS,
    Legend,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    type ChartData,
    type ChartDataset,
    type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { enUS } from 'date-fns/locale'
import { colors, useDialogPluginComponent } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { Scatter } from 'vue-chartjs'

// Register ChartJS plugins and components
ChartJS.register(zoomPlugin, Title, Tooltip, Legend, LinearScale, PointElement, TimeScale)

const infoLogsChartData: Ref<ChartData<'scatter', { x: number; y: number }[]>> = ref({
    datasets: [],
})
const warnLogsChartData: Ref<ChartData<'scatter', { x: number; y: number }[]>> = ref({
    datasets: [],
})
const errorLogsChartData: Ref<ChartData<'scatter', { x: number; y: number }[]>> = ref({
    datasets: [],
})

const infoLogsChartOptions: Ref<ChartOptions<'scatter'>> = ref(
    createChartOptions('Info Logs - Last 6 Months'),
)
const warnLogsChartOptions: Ref<ChartOptions<'scatter'>> = ref(
    createChartOptions('Warning Logs - Last 6 Months'),
)
const errorLogsChartOptions: Ref<ChartOptions<'scatter'>> = ref(
    createChartOptions('Error Logs - Last 6 Months'),
)

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
const selectedStore = useSelectedStore()
buildDataSets()

onUnmounted(() => {
    selectedStore.$reset()
})

function createChartOptions(titleText: string): ChartOptions<'scatter'> {
    return {
        responsive: true,
        aspectRatio: 1,
        plugins: {
            legend: {
                display: true,
                position: 'top',
                align: 'center',
                title: {
                    display: true,
                    text: titleText,
                },
            },
        },
        interaction: {
            intersect: false, // Tooltip triggers when mouse/touch position is near an item
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
            },
            // TODO - Think about how you want this to look
            y: {
                type: 'linear',
                min: 0,
                max: 86400, // Number of seconds in a day
                ticks: {
                    stepSize: 21600, // One hour in seconds
                    callback: function (value) {
                        if (value === 0) return 'Morning'
                        if (value === 43200) return 'Noon'
                        if (value === 86400) return 'Evening'

                        const date = new Date(0, 0, 0, 0, 0, value) // Create a date object with the seconds value
                        return date.toLocaleTimeString('en-US', {
                            hour: 'numeric',
                            minute: 'numeric',
                            hour12: true,
                        })
                    },
                },
            },
        },
    }
}

function refreshChart() {
    buildDataSets()
}

function createDataset(label: string, color: string, count: number) {
    const dataset: ChartDataset<'scatter', { x: number; y: number }[]> = {
        label,
        backgroundColor: colors.getPaletteColor(color),
        data: [],
    }

    const startTime = Date.now()
    const endTime = startTime - DurationMSEnum['One Year'] // Testing

    for (let i = 0; i < count; i++) {
        const randomTime = new Date(startTime + Math.random() * (endTime - startTime)).getTime()
        const timeOfDay =
            new Date(randomTime).getHours() * 3600 +
            new Date(randomTime).getMinutes() * 60 +
            new Date(randomTime).getSeconds()
        dataset.data.push({ x: randomTime, y: timeOfDay })
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
    const warnDataset = createDataset('Warning', 'warning', 20)
    const errorDataset = createDataset('Error', 'negative', 10)

    console.log('Datasets:', [infoDataset, warnDataset, errorDataset])

    infoLogsChartData.value = {
        datasets: [infoDataset],
    }
    warnLogsChartData.value = {
        datasets: [warnDataset],
    }
    errorLogsChartData.value = {
        datasets: [errorDataset],
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
            <q-toolbar-title>Log Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row q-gutter-sm">
                    <q-btn class="col" label="Refresh" color="positive" @click="refreshChart()" />
                </div>
            </q-card-section>

            <q-card-section>
                <Scatter
                    ref="infoLogsChartRef"
                    :options="infoLogsChartOptions"
                    :data="infoLogsChartData"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />
            </q-card-section>

            <q-card-section>
                <Scatter
                    ref="warnLogsChartRef"
                    :options="warnLogsChartOptions"
                    :data="warnLogsChartData"
                    style="max-height: 500px"
                />
                <div class="q-mt-xl" />
            </q-card-section>

            <q-card-section>
                <Scatter
                    ref="errorLogsChartRef"
                    :options="errorLogsChartOptions"
                    :data="errorLogsChartData"
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
