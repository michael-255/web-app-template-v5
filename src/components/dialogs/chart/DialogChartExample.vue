<script setup lang="ts">
import ExampleResultsService from '@/services/ExampleResultsService'
import { closeIcon, createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    type ChartData,
    type ChartOptions,
} from 'chart.js'
import 'chartjs-adapter-date-fns'
import { enUS } from 'date-fns/locale'
import { colors, useDialogPluginComponent } from 'quasar'
import { computed, onMounted, onUnmounted, ref, type ComputedRef, type Ref } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    LinearScale,
    PointElement,
    LineElement,
    CategoryScale,
    TimeScale,
)

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const selectedStore = useSelectedStore()
const exampleResultsService = ExampleResultsService()

const chartDataset: Ref<{ x: any; y: any }[]> = ref([])

const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
        title: {
            display: true,
            text: 'Mock Data',
            color: 'white',
            font: {
                size: 14,
            },
        },
        legend: {
            display: false,
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
            ticks: {
                autoSkip: true,
                maxRotation: 50,
                minRotation: 50,
            },
        },
    },
}

const chartData: ComputedRef<ChartData<'line', { x: number; y: number }[]>> = computed(() => {
    return {
        datasets: [
            {
                label: '',
                data: chartDataset.value,
                borderColor: colors.getPaletteColor('primary'),
                backgroundColor: colors.getPaletteColor('white'),
            },
        ],
    }
})

onMounted(async () => {
    // TODO
    // Have 3 charts: Last 3 Months, Last Year, All Time
    chartDataset.value = await exampleResultsService.getChartDataset(selectedStore.example.id)
})

onUnmounted(() => {
    selectedStore.$reset()
})
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
            <q-toolbar-title>Example Charts</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <Line :options="chartOptions" :data="chartData" style="max-height: 500px" />
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
