<script setup lang="ts">
import { downIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'

const $q = useQuasar()

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
        :disable="$q.loading.isActive"
        :icon="downIcon"
        class="floating-fab-menu q-mr-sm"
        glossy
        color="accent"
        direction="down"
    >
        <slot />
    </q-fab>
</template>

<style scoped>
.floating-fab-menu {
    position: sticky;
    float: right;
    top: 84px;
    transform: translateY(-25px) translateX(8px);
}
</style>
