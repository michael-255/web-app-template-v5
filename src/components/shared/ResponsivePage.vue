<script setup lang="ts">
import { Icon } from '@/shared'

/**
 * Responsive page with a page scroller. Additional bottom margin is added to the page content to
 * make more room for the scroller. Use the slot for your page content.
 */
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div class="responsive-container">
                <slot />
                <div class="q-mt-xl eof-dashed-line" />
            </div>
        </div>

        <q-page-scroller position="bottom">
            <q-btn fab glossy :icon="Icon.topOfPage" color="accent" />
        </q-page-scroller>
    </q-page>
</template>

<style scoped>
.responsive-container {
    width: 100%;
    max-width: 800px;
}

.eof-dashed-line {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}
</style>
