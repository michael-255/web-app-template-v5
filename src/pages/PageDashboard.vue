<script setup lang="ts">
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import { DurationMSEnum, TagEnum } from '@/shared/enums'
import {
    addEntryIcon,
    addIcon,
    chartsIcon,
    databaseIcon,
    deleteIcon,
    editIcon,
    examplesPageIcon,
    favoriteOffIcon,
    favoriteOnIcon,
    inspectIcon,
    verticalDotMenuIcon,
} from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import { useTimeAgo } from '@vueuse/core'
import { extend, useMeta } from 'quasar'
import { onUnmounted, ref, type Ref } from 'vue'

useMeta({ title: `${appName} - Dashboard` })

const { log } = useLogger()
const { onConfirmDialog, onDeleteDialog, onInspectDialog, onCreateDialog, onEditDialog } =
    useDialogs()
const { routeTable, goToTable } = useRouting()

const liveRecords: Ref<ModelType[]> = ref([])

const service = DatabaseManager.getService(routeTable!)
const subscription = service.liveDashboard(DB).subscribe({
    next: (records) => (liveRecords.value = records),
    error: (error) => log.error('Error loading live data', error as Error),
})

onUnmounted(() => {
    subscription.unsubscribe()
})

const setTimeAgoColor = (record: ModelType) => {
    if (!record?.lastChild?.createdAt) {
        return 'grey'
    }
    const timeAgoValue = record.lastChild.createdAt - Date.now()

    if (timeAgoValue < -DurationMSEnum['One Month']) {
        return 'warning'
    } else if (timeAgoValue < -DurationMSEnum['One Day']) {
        return 'positive'
    } else {
        return 'primary'
    }
}

function onToggleFavorite(record: ModelType) {
    const model: ModelType = extend(true, {}, record)
    const action = model.tags.includes(TagEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
    const message = `Do you want to ${action.toLocaleLowerCase()} ${model.name}?`
    const icon = model.tags.includes(TagEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

    onConfirmDialog({
        title: action,
        message,
        color: 'info',
        icon,
        onOk: async () => {
            try {
                await service.toggleFavorite(DB, model)
                log.info(`${action}d ${model.name}`, model)
            } catch (error) {
                log.error(`${action} failed`, error as Error)
            }
        },
    })
}
</script>

<template>
    <ResponsivePage>
        <DialogInstructionsOverlay />

        <FabMenu>
            <q-fab-action
                glossy
                :icon="databaseIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Examples"
                @click="goToTable(service.table)"
            />
            <q-fab-action
                glossy
                :icon="databaseIcon"
                color="warning"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                @click="goToTable(service.childTable)"
            />
            <q-fab-action
                glossy
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
                @click="onCreateDialog(service.table)"
            />
        </FabMenu>

        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Examples" />

        <q-list padding>
            <q-item v-for="record in liveRecords" :key="record.id">
                <q-item-section>
                    <q-card>
                        <q-item class="q-mt-sm">
                            <q-item-section top>
                                <q-item-label class="text-bold text-body1">
                                    {{ record.name }}
                                </q-item-label>

                                <q-item-label v-if="record?.lastChild?.createdAt" caption>
                                    <div>{{ compactDateFromMs(record.lastChild.createdAt) }}</div>
                                    <q-badge
                                        outline
                                        :color="setTimeAgoColor(record)"
                                        class="q-mt-xs"
                                    >
                                        {{ useTimeAgo(record.lastChild.createdAt).value }}
                                    </q-badge>
                                </q-item-label>

                                <q-item-label v-else caption>
                                    No previous records found
                                </q-item-label>
                            </q-item-section>

                            <q-item-section top side>
                                <div class="row">
                                    <q-btn
                                        class="favorite-btn-translation"
                                        flat
                                        dense
                                        round
                                        :color="
                                            record.tags.includes(TagEnum.FAVORITED)
                                                ? 'amber'
                                                : 'grey'
                                        "
                                        :icon="
                                            record.tags.includes(TagEnum.FAVORITED)
                                                ? favoriteOnIcon
                                                : favoriteOffIcon
                                        "
                                        @click="onToggleFavorite(record)"
                                    />

                                    <q-btn
                                        class="vert-menu-btn-translation"
                                        flat
                                        dense
                                        round
                                        :icon="verticalDotMenuIcon"
                                    >
                                        <q-menu
                                            auto-close
                                            anchor="top right"
                                            transition-show="flip-right"
                                            transition-hide="flip-left"
                                        >
                                            <q-list>
                                                <q-item
                                                    v-if="service.supportsCharts"
                                                    :disable="!record?.lastChild"
                                                    clickable
                                                    @click="log.debug('Not Implemented', record)"
                                                >
                                                    <q-item-section avatar>
                                                        <q-icon color="accent" :name="chartsIcon" />
                                                    </q-item-section>
                                                    <q-item-section>Charts</q-item-section>
                                                </q-item>

                                                <q-item
                                                    v-if="service.supportsInspect"
                                                    clickable
                                                    @click="onInspectDialog(record.id)"
                                                >
                                                    <q-item-section avatar>
                                                        <q-icon
                                                            color="primary"
                                                            :name="inspectIcon"
                                                        />
                                                    </q-item-section>
                                                    <q-item-section>Inspect</q-item-section>
                                                </q-item>

                                                <q-item
                                                    v-if="service.supportsEdit"
                                                    :disable="record.tags.includes(TagEnum.LOCKED)"
                                                    clickable
                                                    @click="onEditDialog(record.id)"
                                                >
                                                    <q-item-section avatar>
                                                        <q-icon color="warning" :name="editIcon" />
                                                    </q-item-section>
                                                    <q-item-section>Edit</q-item-section>
                                                </q-item>

                                                <q-item
                                                    v-if="service.supportsDelete"
                                                    clickable
                                                    @click="onDeleteDialog(record.id)"
                                                >
                                                    <q-item-section avatar>
                                                        <q-icon
                                                            color="negative"
                                                            :name="deleteIcon"
                                                        />
                                                    </q-item-section>
                                                    <q-item-section>Delete</q-item-section>
                                                </q-item>
                                            </q-list>
                                        </q-menu>
                                    </q-btn>
                                </div>
                            </q-item-section>
                        </q-item>

                        <q-item v-if="record.desc">
                            <q-item-section>
                                <q-item-label>
                                    {{ record.desc }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-item v-if="record?.lastChild?.note">
                            <q-item-section>
                                <q-item-label>
                                    {{ record.lastChild.note }}
                                </q-item-label>
                            </q-item-section>
                        </q-item>

                        <q-card-actions>
                            <q-btn
                                color="primary"
                                label="Add Entry"
                                class="full-width"
                                :icon="addEntryIcon"
                                @click="onCreateDialog(service.childTable, record.id)"
                            />
                        </q-card-actions>
                    </q-card>
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
