<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Tests` })
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action glossy :icon="Icon.configs" color="primary" />
            <q-fab-action glossy :icon="Icon.results" color="primary" />
            <q-fab-action glossy :icon="Icon.add" color="positive" />
        </FabMenu>

        <PageHeading :headingIcon="Icon.tests" headingTitle="Tests" />

        <div v-for="n in 150" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium
            molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores
            pariatur eos numquam rerum delectus commodi perferendis voluptate?
        </div>
    </ResponsivePage>
</template>
