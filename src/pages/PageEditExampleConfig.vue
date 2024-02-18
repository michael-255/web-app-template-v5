<script setup lang="ts">
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { editIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Edit Example Config` })
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="editIcon" headingTitle="Edit Example Config" />
    </ResponsivePage>
</template>
