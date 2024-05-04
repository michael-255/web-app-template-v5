<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { DurationMSEnum, TableEnum, TagEnum } from '@/shared/enums'
import {
    addEntryIcon,
    chartsIcon,
    deleteIcon,
    editIcon,
    favoriteOffIcon,
    favoriteOnIcon,
    inspectIcon,
    verticalDotMenuIcon,
} from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import { useTimeAgo } from '@vueuse/core'
import { extend, useQuasar } from 'quasar'

const props = defineProps<{
    record: ModelType
    table: TableEnum
    hasCharts: boolean
    hasInspect: boolean
    hasEdit: boolean
    hasDelete: boolean
}>()

/**
 * Emitted events will return the entire parent model.
 */
const emits = defineEmits(['onCharts', 'onInspect', 'onEdit', 'onDelete'])

const $q = useQuasar()
const { log } = useLogger()
const { onCreateDialog } = useDialogs()

const service = DatabaseManager.getService(props.table)

const setTimeAgoColor = () => {
    if (!props.record?.lastChild?.createdAt) {
        return 'grey'
    }
    const timeAgoValue = props.record.lastChild.createdAt - Date.now()

    if (timeAgoValue < -DurationMSEnum['One Month']) {
        return 'warning'
    } else if (timeAgoValue < -DurationMSEnum['One Day']) {
        return 'positive'
    } else {
        return 'primary'
    }
}

function onToggleFavorite() {
    const model: ModelType = extend(true, {}, props.record)
    const action = model.tags.includes(TagEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
    const message = `Do you want to ${action.toLocaleLowerCase()} ${model.name}?`
    const icon = model.tags.includes(TagEnum.FAVORITED) ? favoriteOffIcon : favoriteOnIcon

    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: action,
            message,
            color: 'info',
            icon,
        },
    }).onOk(async () => {
        try {
            await service.toggleFavorite(DB, model)
            log.info(`${action}d ${model.name}`, model)
        } catch (error) {
            log.error(`${action} failed`, error as Error)
        }
    })
}
</script>

<template>
    <q-card>
        <q-item class="q-mt-sm">
            <q-item-section top>
                <q-item-label class="text-bold text-body1">
                    {{ record.name }}
                </q-item-label>

                <q-item-label v-if="record?.lastChild?.createdAt" caption>
                    <div>{{ compactDateFromMs(record.lastChild.createdAt) }}</div>
                    <q-badge outline :color="setTimeAgoColor()" class="q-mt-xs">
                        {{ useTimeAgo(record.lastChild.createdAt).value }}
                    </q-badge>
                </q-item-label>

                <q-item-label v-else caption> No previous records found </q-item-label>
            </q-item-section>

            <q-item-section top side>
                <div class="row">
                    <q-btn
                        class="favorite-btn-translation"
                        flat
                        dense
                        round
                        :color="record.tags.includes(TagEnum.FAVORITED) ? 'amber' : 'grey'"
                        :icon="
                            record.tags.includes(TagEnum.FAVORITED)
                                ? favoriteOnIcon
                                : favoriteOffIcon
                        "
                        @click="onToggleFavorite()"
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
                                    v-if="hasCharts"
                                    :disable="!record?.lastChild"
                                    clickable
                                    @click="emits('onCharts', props.record)"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="accent" :name="chartsIcon" />
                                    </q-item-section>
                                    <q-item-section>Charts</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="hasInspect"
                                    clickable
                                    @click="emits('onInspect', props.record)"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="primary" :name="inspectIcon" />
                                    </q-item-section>
                                    <q-item-section>Inspect</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="hasEdit"
                                    :disable="record.tags.includes(TagEnum.LOCKED)"
                                    clickable
                                    @click="emits('onEdit', props.record)"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="warning" :name="editIcon" />
                                    </q-item-section>
                                    <q-item-section>Edit</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="hasDelete"
                                    clickable
                                    @click="emits('onDelete', props.record)"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="negative" :name="deleteIcon" />
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
</template>

<style scoped>
.vert-menu-btn-translation {
    transform: translateY(-12px) translateX(12px);
}
.favorite-btn-translation {
    transform: translateY(-12px) translateX(12px);
}
</style>
