<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useExampleDialogs from '@/composables/useExampleDialogs'
import useExampleResultDialogs from '@/composables/useExampleResultDialogs'
import useLogger from '@/composables/useLogger'
import type { ExampleType } from '@/models/Example'
import ExampleService from '@/services/ExampleService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum } from '@/shared/enums'
import { addIcon, databaseIcon, examplesPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()
const {
    toggleFavoriteExampleDialog,
    createExampleDialog,
    chartExampleDialog,
    inspectExampleDialog,
    editExampleDialog,
    deleteExampleDialog,
} = useExampleDialogs()
const { createExampleResultDialog } = useExampleResultDialogs()

const subscriptionFinished = ref(false)
const liveExamples: Ref<ExampleType[]> = ref([])
const subscription = ExampleService.liveDashboardObservable().subscribe({
    next: (examples) => {
        liveExamples.value = examples
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error('Error loading live Examples data', error as Error)
        subscriptionFinished.value = true
    },
})

onUnmounted(() => {
    subscription.unsubscribe()
})
</script>

<template>
    <ResponsivePage>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Examples Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXAMPLES_TABLE }),
                },
                {
                    label: 'Example Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    handleClick: () => router.push({ name: RouteNameEnum.EXAMPLE_RESULTS_TABLE }),
                },
                {
                    label: 'Create Example',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: createExampleDialog,
                },
            ]"
        />

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveExamples && liveExamples.length == 0 && subscriptionFinished"
                :title="`No Activated Examples Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new Example below.',
                    'Don\'t see an Example that you created? Make sure it is not deactivated.',
                ]"
                buttonLabel="Create Example"
                buttonColor="positive"
                @onEmptyAction="createExampleDialog"
            />

            <q-item v-for="example in liveExamples" :key="example.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="example?.name"
                        :recordDesc="example?.desc"
                        :recordLastChildCreatedAt="example?.lastChild?.createdAt"
                        :recordLastChildNote="example?.lastChild?.note"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!example?.lastChild"
                        :hasLockedStatus="example.status.includes(StatusEnum.LOCKED)"
                        :hasFavoriteStatus="example.status.includes(StatusEnum.FAVORITED)"
                        :supportsCharts="ExampleService.supportsCharts"
                        :supportsInspect="ExampleService.supportsInspect"
                        :supportsEdit="ExampleService.supportsEdit"
                        :supportsDelete="ExampleService.supportsDelete"
                        @onCharts="chartExampleDialog(example.id)"
                        @onInspect="inspectExampleDialog(example.id)"
                        @onEdit="editExampleDialog(example.id)"
                        @onDelete="deleteExampleDialog(example.id)"
                        @onFavorite="toggleFavoriteExampleDialog(example)"
                        @onAddEntry="createExampleResultDialog(example.id)"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
