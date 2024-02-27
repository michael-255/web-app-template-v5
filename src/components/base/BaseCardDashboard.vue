<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import Example from '@/models/Example'
import DB from '@/services/Database'
import {
    chartsIcon,
    deleteIcon,
    editIcon,
    favoriteOffIcon,
    favoriteOnIcon,
    inspectIcon,
    verticalDotMenuIcon,
} from '@/shared/icons'
import { useTimeAgo } from '@vueuse/core'

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

const { log } = useLogger()
const { dialogConfirm } = useDialogs()

function onToggleFavorite() {
    const action = props.parentModel.favorited ? 'Unfavorite' : 'Favorite'
    const message = `Do you want to ${action.toLocaleLowerCase()} ${props.parentModel.name}?`
    const icon = props.parentModel.favorited ? favoriteOffIcon : favoriteOnIcon

    dialogConfirm(action, message, 'info', icon, async () => {
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
                    <div>{{ parentModel.lastChildCreatedAt }}</div>
                    <div>{{ useTimeAgo(parentModel.lastChildCreatedAt) }}</div>
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
                                :disable="parentModel.locked"
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
                    :color="parentModel.favorited ? 'amber' : 'grey'"
                    :icon="parentModel.favorited ? favoriteOnIcon : favoriteOffIcon"
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
