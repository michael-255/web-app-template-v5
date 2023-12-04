<script setup lang="ts">
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Examples` })
</script>

<template>
    <q-page padding>
        <h4>Examples</h4>

        <div v-for="n in 150" :key="n">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Fugit nihil praesentium molestias a adipisci,
            dolore vitae odit, quidem consequatur optio voluptates asperiores pariatur eos numquam rerum delectus
            commodi perferendis voluptate?
        </div>

        <q-page-sticky position="top-right" :offset="[10, 10]">
            <q-fab color="info" :icon="Icon.down" direction="down">
                <q-fab-action :icon="Icon.configs" color="primary" />
                <q-fab-action :icon="Icon.results" color="primary" />
                <q-fab-action :icon="Icon.add" color="positive" />
            </q-fab>
        </q-page-sticky>
    </q-page>
</template>
