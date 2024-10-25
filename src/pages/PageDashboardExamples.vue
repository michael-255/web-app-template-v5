<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import PageFabMenu from '@/components/page/PageFabMenu.vue'
import PageHeading from '@/components/page/PageHeading.vue'
import PageResponsive from '@/components/page/PageResponsive.vue'
import useLogger from '@/composables/useLogger'
import type { ExampleType } from '@/models/Example'
import ExampleResultService from '@/services/ExampleResultService'
import ExampleService from '@/services/ExampleService'
import { appName } from '@/shared/constants'
import { RouteNameEnum, StatusEnum, TableEnum } from '@/shared/enums'
import { addIcon, databaseIcon, examplesPageIcon } from '@/shared/icons'
import { useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'
import { useRouter } from 'vue-router'

useMeta({ title: `${appName} - Examples Dashboard` })

const $q = useQuasar()
const router = useRouter()
const { log } = useLogger()

const subscriptionFinished = ref(false)
const liveExamples: Ref<ExampleType[]> = ref([])
const subscription = ExampleService.liveDashboard().subscribe({
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
    <PageResponsive>
        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Examples Data',
                    color: 'primary',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.EXAMPLES },
                        }),
                },
                {
                    label: 'Example Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    handleClick: () =>
                        router.push({
                            name: RouteNameEnum.TABLE,
                            params: { table: TableEnum.EXAMPLE_RESULTS },
                        }),
                },
                {
                    label: 'Create Example',
                    color: 'positive',
                    icon: addIcon,
                    handleClick: () => $q.dialog(ExampleService.createDialogOptions()),
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
                    'Don\'t see an Example that you created? Make sure it does not have the hidden status.',
                ]"
                buttonLabel="Create Example"
                buttonColor="positive"
                @onEmptyAction="() => $q.dialog(ExampleService.createDialogOptions())"
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
                        @onCharts="() => $q.dialog(ExampleService.chartsDialogOptions(example.id))"
                        @onInspect="
                            () => $q.dialog(ExampleService.inspectDialogOptions(example.id))
                        "
                        @onEdit="() => $q.dialog(ExampleService.editDialogOptions(example.id))"
                        @onDelete="() => $q.dialog(ExampleService.deleteDialogOptions(example.id))"
                        @onFavorite="
                            () => $q.dialog(ExampleService.toggleFavoriteDialogOptions(example.id))
                        "
                        @onAddEntry="
                            () => $q.dialog(ExampleResultService.createDialogOptions(example.id))
                        "
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </PageResponsive>
</template>
