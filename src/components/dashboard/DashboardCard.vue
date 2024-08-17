<script setup lang="ts">
import { DurationMSEnum } from '@/shared/enums'
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
import type { NameType, TextAreaType, TimestampType } from '@/shared/types'
import { compactDateFromMs } from '@/shared/utils'
import { useTimeAgo } from '@vueuse/core'

defineProps<{
    recordName: NameType
    recordDesc: TextAreaType
    recordLastChildCreatedAt?: TimestampType
    isLoading: boolean
    hasLastChild: boolean
    hasLockedTag: boolean
    hasFavoriteTag: boolean
    supportsCharts: boolean
    supportsInspect: boolean
    supportsEdit: boolean
    supportsDelete: boolean
}>()

const emit = defineEmits<{
    (event: 'onCharts'): void
    (event: 'onInspect'): void
    (event: 'onEdit'): void
    (event: 'onDelete'): void
    (event: 'onFavorite'): void
    (event: 'onAddEntry'): void
}>()

const setTimeAgoColor = (timestamp?: TimestampType) => {
    if (!timestamp) return 'grey'

    const timeAgoValue = Date.now() - timestamp

    if (timeAgoValue > DurationMSEnum['Three Months']) {
        return 'negative'
    } else if (timeAgoValue > DurationMSEnum['One Month']) {
        return 'warning'
    } else if (timeAgoValue > DurationMSEnum['One Day']) {
        return 'positive'
    } else {
        return 'primary'
    }
}
</script>

<template>
    <q-card>
        <q-item class="q-mt-sm">
            <q-item-section top>
                <q-item-label class="text-bold text-body1">
                    {{ recordName }}
                </q-item-label>

                <q-item-label v-if="recordLastChildCreatedAt" caption>
                    <div>{{ compactDateFromMs(recordLastChildCreatedAt) }}</div>
                    <q-badge
                        outline
                        :color="setTimeAgoColor(recordLastChildCreatedAt)"
                        class="q-mt-xs"
                    >
                        {{ useTimeAgo(recordLastChildCreatedAt).value }}
                    </q-badge>
                </q-item-label>

                <q-item-label v-else caption> No previous records found </q-item-label>
            </q-item-section>
            <q-item-section top side>
                <div class="row">
                    <q-btn
                        :disable="isLoading"
                        class="favorite-btn-translation"
                        flat
                        dense
                        round
                        :color="hasFavoriteTag ? 'amber' : 'grey'"
                        :icon="hasFavoriteTag ? favoriteOnIcon : favoriteOffIcon"
                        @click="emit('onFavorite')"
                    />
                    <q-btn
                        :disable="isLoading"
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
                                    v-if="supportsCharts"
                                    :disable="!hasLastChild || isLoading"
                                    clickable
                                    @click="emit('onCharts')"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="accent" :name="chartsIcon" />
                                    </q-item-section>
                                    <q-item-section>Charts</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="supportsInspect"
                                    :disable="isLoading"
                                    clickable
                                    @click="emit('onInspect')"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="primary" :name="inspectIcon" />
                                    </q-item-section>
                                    <q-item-section>Inspect</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="supportsEdit"
                                    :disable="hasLockedTag || isLoading"
                                    clickable
                                    @click="emit('onEdit')"
                                >
                                    <q-item-section avatar>
                                        <q-icon color="warning" :name="editIcon" />
                                    </q-item-section>
                                    <q-item-section>Edit</q-item-section>
                                </q-item>

                                <q-item
                                    v-if="supportsDelete"
                                    :disable="hasLockedTag || isLoading"
                                    clickable
                                    @click="emit('onDelete')"
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

        <q-item v-if="recordDesc">
            <q-item-section>
                <q-item-label>
                    {{ recordDesc }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-card-actions>
            <q-btn
                :disable="hasLockedTag || isLoading"
                color="primary"
                label="Add Entry"
                class="full-width"
                :icon="addEntryIcon"
                @click="emit('onAddEntry')"
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
