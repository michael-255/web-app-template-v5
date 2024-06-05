<script setup lang="ts">
import { DurationMSEnum } from '@/shared/enums'
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
import { date, uid, useDialogPluginComponent } from 'quasar'
import { ref, type Ref } from 'vue'
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

const chartData: Ref<any> = ref({
    labels: [],
    datasets: [],
})

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
buildDataSets() // TODO

function refreshChart() {
    const chart = ChartJS.getChart('chart-instance')
    chart?.resetZoom() // Will need this!
}

function createData(count: number, type: 'random' | 'linear-up' | 'linear-down') {
    const data = []
    let time = Date.now()
    for (let i = 0; i < count; i++) {
        // TODO: make calculated numbers better
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

function buildDataSets() {
    const whirlygigs = createData(50, 'random')
    const thingamajigs = createData(50, 'linear-up')
    const doohickeys = createData(50, 'linear-down')

    console.log('Whirlygigs:', whirlygigs)
    console.log('Thingamajigs:', thingamajigs)
    console.log('Doohickeys:', doohickeys)

    // X-axis labels
    // TODO: need x-aixs labels to work for ALL datasets
    const chartLabels = whirlygigs.map((r: Record<string, any>) =>
        date.formatDate(r.createdAt, 'YYYY MMM D'),
    )

    const data1 = whirlygigs.map((r: Record<string, any>) => r.number)
    const data2 = thingamajigs.map((r: Record<string, any>) => r.number)
    const data3 = doohickeys.map((r: Record<string, any>) => r.number)

    const dataset1 = {
        label: 'Whirlygigs',
        backgroundColor: 'white',
        borderColor: '#1976d2',
        data: data1,
    }
    const dataset2 = {
        label: 'Thingamajigs',
        backgroundColor: 'white',
        borderColor: '#607d8b',
        data: data2,
    }
    const dataset3 = {
        label: 'Doohickeys',
        backgroundColor: 'white',
        borderColor: '#673ab7',
        data: data3,
    }

    chartData.value = {
        labels: chartLabels,
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
