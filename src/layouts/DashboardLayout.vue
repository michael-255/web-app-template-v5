<script setup lang="ts">
import { Constant, Enum, Icon } from '@/shared'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

function goToDashboard() {
    router.push({ name: Enum.RouteName.DASHBOARD })
}
</script>

<template>
    <q-layout view="hHh LpR lff">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title @click="goToDashboard" class="text-center">{{ Constant.AppName }}</q-toolbar-title>
            </q-toolbar>

            <q-btn-group flat square spread unelevated>
                <q-btn unelevated :icon="Icon.examples" />
                <q-btn unelevated :icon="Icon.debug" />
                <q-btn unelevated :icon="Icon.settings" to="/settings" />
            </q-btn-group>
        </q-header>

        <q-page-container>
            <router-view />

            <q-page-scroller>
                <q-btn fab :icon="Icon.up" color="accent" />
            </q-page-scroller>
        </q-page-container>
    </q-layout>
</template>
