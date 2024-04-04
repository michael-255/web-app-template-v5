<script setup lang="ts">
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { databaseIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Table` })
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="databaseIcon" headingTitle="Table" />

        <div>TEST</div>
    </ResponsivePage>
</template>
