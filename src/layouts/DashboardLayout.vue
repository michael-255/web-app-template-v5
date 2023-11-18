<script setup lang="ts">
import { Constant, Enum, Icon } from '@/shared'
import { ref } from 'vue'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()
const tab = ref('examples')

function goToDashboard() {
    router.push({ name: Enum.RouteName.DASHBOARD })
}
</script>

<template>
    <q-layout view="hHh LpR lff">
        <q-header elevated>
            <q-toolbar>
                <q-avatar @click="goToDashboard">
                    <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg" />
                </q-avatar>

                <q-toolbar-title>{{ Constant.AppName }}</q-toolbar-title>

                <q-btn flat round color="yellow" :icon="Icon.donate" to="/donate" />
                <q-btn flat round :icon="Icon.settings" to="/settings" />
            </q-toolbar>

            <q-tabs v-model="tab">
                <q-tab name="examples" :no-caps="true" label="Examples" :icon="Icon.examples" />
                <q-tab name="tests" :no-caps="true" label="Tests" :icon="Icon.debug" />
            </q-tabs>
        </q-header>

        <q-page-container>
            <router-view />

            <q-page-scroller>
                <q-btn fab :icon="Icon.up" color="accent" />
            </q-page-scroller>
        </q-page-container>
    </q-layout>
</template>
