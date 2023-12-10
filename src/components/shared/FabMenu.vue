<script setup lang="ts">
import { Icon } from '@/shared'

/**
 * FAB menu for the top right corner of screen. This should be the first component in the page.
 * Add actions using the slot (example below).
 * @example
 * <fab-menu>
 *     <q-fab-action glossy :icon="Icon.info" color="primary" />
 * </fab-menu>
 */
</script>

<template>
    <q-fab
        class="floating-fab-menu q-mr-md"
        glossy
        color="primary"
        :icon="Icon.down"
        direction="down"
    >
        <slot />
    </q-fab>
</template>

<style scoped>
.floating-fab-menu {
    position: sticky;
    float: right;
    top: 75px;
    z-index: 1000;
}
</style>
