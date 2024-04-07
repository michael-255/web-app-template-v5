<script setup lang="ts">
import BaseMutationForm from '@/components/forms/BaseMutationForm.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useRouting from '@/composables/useRouting'
import { appName } from '@/shared/constants'
import { editIcon } from '@/shared/icons'
import { getTableLabel } from '@/shared/utils'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Edit` })

const { routeTable } = useRouting()
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading
            :headingIcon="editIcon"
            :headingTitle="`Create ${getTableLabel(routeTable)}`"
        />
        <BaseMutationForm :table="routeTable" />
    </ResponsivePage>
</template>
