<script setup lang="ts">
import { Icon } from '@/shared'

/**
 * FAB menu for the top right corner of screen. This should be the first component in the q-page.
 * The positioning classes are important to make sure the menu does not move when scrolling and is
 * always visible in the same spot on every page. Add actions using the slot (example below).
 * @example
 * <fab-menu>
 *     <q-fab-action glossy :icon="Icon.info" color="primary" external-label label-position="left" label="Info" />
 * </fab-menu>
 */
</script>

<template>
    <q-fab
        class="floating-fab-menu q-mr-sm"
        glossy
        color="accent"
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
    top: 92px;
    transform: translateY(-25px);
}
</style>
