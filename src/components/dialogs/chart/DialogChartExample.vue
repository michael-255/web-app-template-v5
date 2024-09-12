<script setup lang="ts">
import { closeIcon, createIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'
import {
    CategoryScale,
    Chart as ChartJS,
    Legend,
    LinearScale,
    LineElement,
    PointElement,
    Title,
    Tooltip,
    type ChartData,
    type ChartOptions,
} from 'chart.js'
import { colors, useDialogPluginComponent } from 'quasar'
import { computed, onUnmounted, type ComputedRef } from 'vue'
import { Line } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, LinearScale, PointElement, LineElement, CategoryScale)

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const selectedStore = useSelectedStore()

const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    aspectRatio: 1,
    plugins: {
        title: {
            display: true,
            text: 'TEST',
            color: 'white',
            font: {
                size: 14,
            },
        },
        legend: {
            display: true,
            position: 'top',
            align: 'center',
        },
    },
    interaction: {
        intersect: false, // Tooltip triggers when mouse/touch position is near an item
    },
}

const chartData: ComputedRef<ChartData<'line', { x: number; y: number }[]>> = computed(() => {
    return {
        datasets: [
            {
                label: 'TEST',
                backgroundColor: colors.getPaletteColor('primary'),
                data: [],
            },
        ],
    }
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
