<script setup lang="ts">
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { examplesPageIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Dashboard` })
</script>

<template>
    <ResponsivePage>
        <PageHeading :headingIcon="examplesPageIcon" headingTitle="Testing!!!" />
    </ResponsivePage>
</template>

<style scoped>
.vert-menu-btn-translation {
    transform: translateY(-12px) translateX(12px);
}
.favorite-btn-translation {
    transform: translateY(-12px) translateX(12px);
}
</style>
