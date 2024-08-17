<script setup lang="ts">
import DashboardCard from '@/components/dashboard/DashboardCard.vue'
import DashboardEmptyMessage from '@/components/dashboard/DashboardEmptyMessage.vue'
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import PageFabMenu from '@/components/shared/PageFabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import ExamplesService from '@/services/ExamplesService'
import { appName } from '@/shared/constants'
import { ParentTagEnum, RouteNameEnum } from '@/shared/enums'
import {
    addIcon,
    databaseIcon,
    examplesPageIcon,
    favoriteOffIcon,
    favoriteOnIcon,
} from '@/shared/icons'
import type { ExampleType } from '@/shared/types'
import { extend, useMeta, useQuasar } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Dashboard` })

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const examplesService = ExamplesService()

const subscriptionFinished = ref(false)
const liveExamples: Ref<ExampleType[]> = ref([])
const subscription = examplesService.liveDashboardObservable().subscribe({
    next: (examples) => {
        liveExamples.value = examples
        subscriptionFinished.value = true
    },
    error: (error) => {
        log.error('Error loading live data', error as Error)
        subscriptionFinished.value = true
    },
})

onUnmounted(() => {
    subscription.unsubscribe()
})

function toggleFavorite(example: ExampleType) {
    // Deep copy to prevent issues with the database calls later
    const record: ExampleType = extend(true, {}, example)
    const action = record.tags.includes(ParentTagEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
    const message = `Do you want to ${action.toLocaleLowerCase()} ${record.name}?`
    const icon = record.tags.includes(ParentTagEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

    onConfirmDialog({
        title: action,
        message,
        color: 'info',
        icon,
        onOk: async () => {
            try {
                $q.loading.show()
                await examplesService.toggleFavorite(record)
                log.info(`${action}d ${record.name}`, record)
            } catch (error) {
                log.error(`${action} failed`, error as Error)
            } finally {
                $q.loading.hide()
            }
        },
    })
}
</script>

<template>
    <ResponsivePage>
        <DialogInstructionsOverlay />

        <PageFabMenu
            :isLoading="$q.loading.isActive"
            :subButtons="[
                {
                    label: 'Examples Data',
                    color: 'primary',
                    icon: databaseIcon,
                    routeName: RouteNameEnum.EXAMPLES_TABLE,
                },
                {
                    label: 'Example Results Data',
                    color: 'warning',
                    icon: databaseIcon,
                    routeName: RouteNameEnum.EXAMPLE_RESULTS_TABLE,
                },
                {
                    label: 'Create Example',
                    color: 'positive',
                    icon: addIcon,
                    routeName: RouteNameEnum.DASHBOARD,
                },
            ]"
        />

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <DashboardEmptyMessage
                v-if="liveExamples && liveExamples.length == 0 && subscriptionFinished"
                :title="`No Enabled Examples Found`"
                :messages="[
                    'If this is your first time using the app, try creating a new example below.',
                    'Don\'t see an Example that you created? Make sure it is enabled.',
                ]"
                buttonLabel="Create Example"
                buttonColor="positive"
                @onEmptyAction="() => log.error('Create Example clicked')"
            />

            <q-item v-for="example in liveExamples" :key="example.id">
                <q-item-section>
                    <DashboardCard
                        :recordName="example?.name"
                        :recordDesc="example?.desc"
                        :recordLastChildCreatedAt="example?.lastChild?.createdAt"
                        :isLoading="$q.loading.isActive"
                        :hasLastChild="!!example?.lastChild"
                        :hasLockedTag="example.tags.includes(ParentTagEnum.LOCKED)"
                        :hasFavoriteTag="example.tags.includes(ParentTagEnum.FAVORITED)"
                        :supportsCharts="true"
                        :supportsInspect="true"
                        :supportsEdit="true"
                        :supportsDelete="true"
                        @onCharts="() => log.error('Charts clicked')"
                        @onInspect="() => log.error('Inspect clicked')"
                        @onEdit="() => log.error('Edit clicked')"
                        @onDelete="() => log.error('Delete clicked')"
                        @onFavorite="toggleFavorite(example)"
                        @onAddEntry="() => log.error('Add Entry clicked')"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
