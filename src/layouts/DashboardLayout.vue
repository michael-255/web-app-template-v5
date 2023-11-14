<script setup lang="ts">
import { Constant, Icon } from '@/shared'
import { RouterView } from 'vue-router'
</script>

<template>
    <q-layout view="hHh LpR lff">
        <q-header elevated class="bg-primary">
            <q-toolbar>
                <q-toolbar-title>{{ Constant.AppName }}</q-toolbar-title>
            </q-toolbar>
        </q-header>

        <q-page-container>
            <router-view />

            <q-page-scroller>
                <q-btn fab :icon="Icon.up" color="accent" />
            </q-page-scroller>
        </q-page-container>
    </q-layout>
</template>
