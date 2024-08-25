<script setup lang="ts">
import { DurationMSEnum } from '@/shared/enums'
import { closeIcon, createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import {
    BarElement,
    Chart as ChartJS,
    Legend,
    LinearScale,
    TimeScale,
    Title,
    Tooltip,
    type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import zoomPlugin from 'chartjs-plugin-zoom'
import { enUS } from 'date-fns/locale'
import { colors, uid, useDialogPluginComponent } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { Bar } from 'vue-chartjs'

// Register ChartJS plugins and components
ChartJS.register(zoomPlugin, Title, Tooltip, Legend, LinearScale, BarElement, TimeScale)

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
        intersect: false,
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
buildDataSets()

const selectedStore = useSelectedStore()

onUnmounted(() => {
    selectedStore.$reset()
})

function refreshChart() {
    const chart = ChartJS.getChart('chart-instance')
    chart?.resetZoom() // Will need this!
}

function createData(
    count: number,
    type: 'random' | 'linear-up' | 'linear-down',
    time: number = Date.now(),
) {
    const data = []
    for (let i = 0; i < count; i++) {
        const base = Math.floor(Math.random() * 25) + 250
        const number = {
            random: base,
            'linear-up': base + i,
            'linear-down': base - i,
        }[type]

        data.push({
            id: uid(),
            createdAt: time,
            number,
        })

        time -= DurationMSEnum['One Day']
    }
    return data
}

/**
 * @todo
 * - To make a chart of logs per day, you need a sum of each log type per day.
 * - Only saved logs are available for charting (INFO, WARN, ERROR).
 * - Charts will by of type: time.
 * - You should limit the amount of data you look at based on the unit you choose (day, month, etc).
 */
function buildDataSets() {
    const whirlygigs = createData(200, 'random', Date.now())
    const thingamajigs = createData(80, 'linear-up', Date.now())
    const doohickeys = createData(40, 'linear-down', Date.now())

    // X-axis labels
    const data1 = whirlygigs.map((r: Record<string, any>) => {
        return {
            x: new Date(r.createdAt),
            y: r.number,
        }
    })
    const data2 = thingamajigs.map((r: Record<string, any>) => {
        return {
            x: new Date(r.createdAt),
            y: r.number,
        }
    })
    const data3 = doohickeys.map((r: Record<string, any>) => {
        return {
            x: new Date(r.createdAt),
            y: r.number,
        }
    })

    const infoColor = colors.getPaletteColor('primary')
    const warnColor = colors.getPaletteColor('warning')
    const errorColor = colors.getPaletteColor('negative')

    const dataset1 = {
        label: 'Whirlygigs',
        backgroundColor: infoColor,
        borderColor: '#1976d2',
        data: data1,
    }
    const dataset2 = {
        label: 'Thingamajigs',
        backgroundColor: warnColor,
        borderColor: '#607d8b',
        data: data2,
    }
    const dataset3 = {
        label: 'Doohickeys',
        backgroundColor: errorColor,
        borderColor: '#673ab7',
        data: data3,
    }

    chartData.value = {
        datasets: [dataset1, dataset2, dataset3],
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
                    id="chart-instance"
                    :options="chartOptions"
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
