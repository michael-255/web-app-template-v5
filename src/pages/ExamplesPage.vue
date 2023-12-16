<script setup lang="ts">
import FabMenu from '@/components/shared/FabMenu.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Examples` })
</script>

<template>
    <ResponsivePage>
        <FabMenu>
            <q-fab-action
                glossy
                :icon="Icon.configs"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Configs"
            />
            <q-fab-action
                glossy
                :icon="Icon.results"
                color="primary"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Results"
            />
            <q-fab-action
                glossy
                :icon="Icon.add"
                color="positive"
                external-label
                label-class="bg-grey-9 text-grey-2"
                label-position="left"
                label="Create"
            />
        </FabMenu>

        <PageHeading :headingIcon="Icon.examples" headingTitle="Examples" />

        <div v-for="n in 100" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium
            molestias a adipisci, dolore vitae odit, quidem consequatur optio voluptates asperiores
            pariatur eos numquam rerum delectus commodi perferendis voluptate?
        </div>
    </ResponsivePage>
</template>
