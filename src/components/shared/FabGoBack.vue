<script setup lang="ts">
import useRouting from '@/composables/useRouting'
import { backIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const { goBack } = useRouting()

/**
 * FAB Go Back for the top right corner of screen. This should be the first component in the q-page.
 * The positioning classes are important to make sure the menu does not move when scrolling and is
 * always visible in the same spot on every page.
 */
</script>

<template>
    <q-btn
        :disable="$q.loading.isActive"
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
