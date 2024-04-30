<script setup lang="ts">
import { hourGlassIcon, topOfPageIcon } from '@/shared/icons'

/**
 * Responsive page with a page scroller and loading icon. Additional bottom margin is added to the
 * page content to make more room for the scroller. Use the slot for your page content.
 */
defineProps<{
    loading?: boolean
}>()
</script>

<template>
    <q-page padding>
        <div class="row justify-center">
            <div v-show="!loading" class="responsive-container">
                <slot />
                <div class="q-mt-xl" />
            </div>

            <div v-show="loading">
                <div class="row justify-center">
                    <q-icon :name="hourGlassIcon" size="xl" color="grey" class="q-mt-xl" />
                </div>

                <div class="row justify-center text-center text-grey">
                    <div class="text-h6">Loading</div>
                </div>
            </div>
        </div>

        <q-page-scroller position="bottom">
            <q-btn fab glossy :icon="topOfPageIcon" color="accent" />
        </q-page-scroller>
    </q-page>
</template>

<style scoped>
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
