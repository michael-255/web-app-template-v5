<script setup lang="ts">
import DialogInstructionsOverlay from '@/components/dialogs/DialogInstructionsOverlay.vue'
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { appName } from '@/shared/constants'
import { RouteNameEnum } from '@/shared/enums'
import { addIcon, databaseIcon, examplesPageIcon } from '@/shared/icons'
import { useMeta } from 'quasar'

useMeta({ title: `${appName} - Dashboard` })
</script>

<template>
    <ResponsivePage>
        <DialogInstructionsOverlay />

        <FabMenu>
            <q-fab-action
                glossy
                :disable="$q.loading.isActive"
                :icon="databaseIcon"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Examples"
                :to="{ name: RouteNameEnum.EXAMPLES_TABLE }"
            />
            <q-fab-action
                glossy
                :disable="$q.loading.isActive"
                :icon="databaseIcon"
                color="warning"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
                :to="{ name: RouteNameEnum.EXAMPLE_RESULTS_TABLE }"
            />
            <q-fab-action
                glossy
                :disable="$q.loading.isActive"
                :icon="addIcon"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create Example"
            />
        </FabMenu>

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
