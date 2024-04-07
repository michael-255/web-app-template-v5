<script setup lang="ts">
import BaseMutationForm from '@/components/forms/BaseMutationForm.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useRouting from '@/composables/useRouting'
import { appName } from '@/shared/constants'
import { createIcon } from '@/shared/icons'
import { getTableLabel } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Create` })

const { routeTable } = useRouting()
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading
            :headingIcon="createIcon"
            :headingTitle="`Create ${getTableLabel(routeTable)}`"
        />
        <BaseMutationForm :table="routeTable" />
    </ResponsivePage>
</template>
