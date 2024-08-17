<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { backIcon, downIcon } from '@/shared/icons'
import type { RouteNameType } from '@/shared/types'

/**
 * FAB menu for the top right corner of screen. This should be the first component in the q-page.
 * The positioning classes are important to make sure the menu does not move when scrolling and is
 * always visible in the same spot on every page.
 *
 * Omitting the subButtons prop will show the got back button instead.
 */
defineProps<{
    isLoading?: boolean
    subButtons?: {
        label: string
        color: string
        icon: string
        routeName: RouteNameType
    }[]
}>()

const { goBack } = useRouting()
</script>

<template>
    <q-fab
        v-if="subButtons && subButtons.length > 0"
        :disable="isLoading"
        :icon="downIcon"
        class="floating-fab-menu q-mr-sm"
        glossy
        color="accent"
        direction="down"
    >
        <q-fab-action
            v-for="(button, i) in subButtons"
            :key="i"
            :disable="isLoading"
            :icon="button.icon"
            :to="{ name: button.routeName }"
            :label="button.label"
            label-class="bg-grey-9 text-grey-2"
            label-position="left"
            :color="button.color"
            external-label
            glossy
        />
    </q-fab>

    <q-btn
        v-else
        :disable="isLoading"
        :icon="backIcon"
        class="floating-fab-menu q-mr-sm"
        glossy
        fab
        color="accent"
        @click="goBack()"
    />
</template>

<style scoped>
.floating-fab-menu {
    position: sticky;
    float: right;
    top: 84px;
    transform: translateY(-25px) translateX(8px);
}
</style>
