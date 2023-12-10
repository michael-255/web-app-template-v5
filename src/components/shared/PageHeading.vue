<script setup lang="ts">
/**
 * Page heading with icon, title, and a separator.
 */

defineProps<{
    headingIcon?: string
    headingTitle?: string
}>()
</script>

<template>
    <div class="text-h4 q-ma-md text-no-wrap ellipsis">
        <q-icon class="on-left q-pb-xs" :name="headingIcon" />
        {{ headingTitle }}
    </div>

    <q-separator class="q-my-lg" />
</template>
