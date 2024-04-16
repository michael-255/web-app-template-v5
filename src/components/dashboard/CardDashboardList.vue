<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import DB from '@/services/Database'
import { DurationMSEnum, TagEnum } from '@/shared/enums'
import {
    chartsIcon,
    deleteIcon,
    editIcon,
    favoriteOffIcon,
    favoriteOnIcon,
    inspectIcon,
    verticalDotMenuIcon,
} from '@/shared/icons'
import { compactDateFromMs } from '@/shared/utils'
import { useTimeAgo } from '@vueuse/core'
import { useQuasar } from 'quasar'
import DialogConfirm from '../dialogs/DialogConfirm.vue'

const props = defineProps<{
    parentModel: Example
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

const setTimeAgoColor = () => {
    if (!props.parentModel.lastChildCreatedAt) {
        return 'grey'
    }
    const timeAgoValue = props.parentModel.lastChildCreatedAt - Date.now()

    if (timeAgoValue < -DurationMSEnum['One Month']) {
        return 'warning'
    } else if (timeAgoValue < -DurationMSEnum['One Day']) {
        return 'positive'
    } else {
        return 'primary'
    }
}

function onToggleFavorite() {
    const action = props.parentModel.tags.includes(TagEnum.FAVORITED) ? 'Unfavorite' : 'Favorite'
    const message = `Do you want to ${action.toLocaleLowerCase()} ${props.parentModel.name}?`
    const icon = props.parentModel.tags.includes(TagEnum.FAVORITED)
        ? favoriteOffIcon
        : favoriteOnIcon

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
            await DB.toggleFavorite(props.parentModel)
            log.info(`${action}d ${props.parentModel.name}`, props.parentModel)
        } catch (error) {
            log.error(`${action} failed`, error as Error)
        }
    })
}
</script>

<template>
    <q-card>
        <q-item class="q-pt-none">
            <q-item-section>
                <q-item-label class="text-bold text-body1">
                    {{ parentModel.name }}
                </q-item-label>

                <q-item-label v-if="parentModel.lastChildCreatedAt" caption>
                    <div>{{ compactDateFromMs(parentModel.lastChildCreatedAt) }}</div>
                    <q-badge outline :color="setTimeAgoColor()" class="q-mt-xs">
                        {{ useTimeAgo(parentModel.lastChildCreatedAt).value }}
                    </q-badge>
                </q-item-label>

                <q-item-label v-else caption> No previous records found </q-item-label>
            </q-item-section>

            <q-item-section top side>
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
                                :disable="!parentModel.lastChildCreatedAt"
                                clickable
                                @click="emits('onCharts', props.parentModel)"
                            >
                                <q-item-section avatar>
                                    <q-icon color="accent" :name="chartsIcon" />
                                </q-item-section>
                                <q-item-section>Charts</q-item-section>
                            </q-item>

                            <q-item
                                v-if="hasInspect"
                                clickable
                                @click="emits('onInspect', props.parentModel)"
                            >
                                <q-item-section avatar>
                                    <q-icon color="primary" :name="inspectIcon" />
                                </q-item-section>
                                <q-item-section>Inspect</q-item-section>
                            </q-item>

                            <q-item
                                v-if="hasEdit"
                                :disable="parentModel.tags.includes(TagEnum.LOCKED)"
                                clickable
                                @click="emits('onEdit', props.parentModel)"
                            >
                                <q-item-section avatar>
                                    <q-icon color="warning" :name="editIcon" />
                                </q-item-section>
                                <q-item-section>Edit</q-item-section>
                            </q-item>

                            <q-item
                                v-if="hasDelete"
                                clickable
                                @click="emits('onDelete', props.parentModel)"
                            >
                                <q-item-section avatar>
                                    <q-icon color="negative" :name="deleteIcon" />
                                </q-item-section>
                                <q-item-section>Delete</q-item-section>
                            </q-item>
                        </q-list>
                    </q-menu>
                </q-btn>

                <q-btn
                    class="favorite-btn-translation"
                    flat
                    dense
                    round
                    :color="parentModel.tags.includes(TagEnum.FAVORITED) ? 'amber' : 'grey'"
                    :icon="
                        parentModel.tags.includes(TagEnum.FAVORITED)
                            ? favoriteOnIcon
                            : favoriteOffIcon
                    "
                    @click="onToggleFavorite()"
                />
            </q-item-section>
        </q-item>

        <q-item v-if="parentModel.desc">
            <q-item-section>
                <q-item-label>
                    {{ parentModel.desc }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-item v-if="parentModel.lastChildNote">
            <q-item-section>
                <q-item-label>
                    {{ parentModel.lastChildNote }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-card-actions>
            <q-btn color="primary" label="Test" class="full-width" />
        </q-card-actions>
    </q-card>
</template>

<style scoped>
.vert-menu-btn-translation {
    transform: translateX(15px);
}
.favorite-btn-translation {
    transform: translateY(-34px) translateX(-19px);
}
</style>
