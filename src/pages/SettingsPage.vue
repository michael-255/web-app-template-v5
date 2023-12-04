<script setup lang="ts">
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Settings` })
</script>

<template>
    <q-page padding>
        <h4>Settings</h4>

        <q-page-sticky position="top-right" :offset="[10, 10]">
            <q-fab color="info" :icon="Icon.down" direction="down">
                <q-fab-action :icon="Icon.info" color="primary" />
                <q-fab-action :icon="Icon.donate" color="pink" />
            </q-fab>
        </q-page-sticky>
    </q-page>
</template>
