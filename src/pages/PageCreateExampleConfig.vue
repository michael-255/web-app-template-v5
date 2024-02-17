<script setup lang="ts">
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { infoIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Create Example Config` })
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="infoIcon" headingTitle="Create Example Config" />
    </ResponsivePage>
</template>
