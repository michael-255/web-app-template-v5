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
            <div class="max-col-width">
                <div class="col-md-8 col-sm-10 col-xs-12">
                    <slot />
                    <div class="q-mt-xl dashed-line" />
                </div>
            </div>
        </div>

        <q-page-scroller position="bottom">
            <q-btn fab glossy :icon="Icon.topOfPage" color="accent" />
        </q-page-scroller>
    </q-page>
</template>

<style scoped>
.max-col-width {
    max-width: 800px;
}

.dashed-line {
    border-bottom: 1px dashed rgba(255, 255, 255, 0.15);
}
</style>
