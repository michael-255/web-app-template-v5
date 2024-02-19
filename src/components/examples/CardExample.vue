<script setup lang="ts">
import { favoriteOnIcon, verticalDotMenuIcon } from '@/shared/icons'
import type { NameType, OptionalTimestampType, TextAreaType } from '@/shared/types'

defineProps<{
    name: NameType
    lastResultAt: OptionalTimestampType
    description: TextAreaType
}>()
</script>

<template>
    <q-card>
        <q-item>
            <q-item-section>
                <q-item-label class="text-weight-bold text-body1">
                    {{ name }}
                </q-item-label>

                <q-item-label v-if="lastResultAt" caption>
                    <div>{{ lastResultAt }}</div>
                    <div>11 days ago (TODO)</div>
                </q-item-label>

                <q-item-label v-else caption> No previous results found </q-item-label>
            </q-item-section>

            <q-item-section top side>
                <q-btn
                    class="vert-menu-btn-translation"
                    flat
                    dense
                    round
                    :icon="verticalDotMenuIcon"
                />
                <q-btn
                    class="favorite-btn-translation"
                    flat
                    dense
                    round
                    color="amber"
                    :icon="favoriteOnIcon"
                />
            </q-item-section>
        </q-item>

        <q-item>
            <q-item-section>
                <q-item-label>
                    {{ description }}
                </q-item-label>
            </q-item-section>
        </q-item>

        <q-card-actions>
            <q-btn color="primary" label="Begin" class="full-width" />
        </q-card-actions>
    </q-card>
</template>
