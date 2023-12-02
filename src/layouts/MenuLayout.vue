<script setup lang="ts">
import { Constant, Enum, Icon } from '@/shared'
import { RouterView, useRouter } from 'vue-router'

const router = useRouter()

function goToPage() {
    router.push({ name: Enum.RouteName.EXAMPLES })
}
</script>

<template>
    <q-layout view="hHh LpR lff">
        <q-header elevated>
            <q-toolbar>
                <q-toolbar-title class="text-body1 text-center" @click="goToPage()">
                    {{ Constant.AppName }}
                </q-toolbar-title>
            </q-toolbar>

            <q-tabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
                <q-route-tab no-caps :icon="Icon.examples" to="/">Examples</q-route-tab>
                <q-route-tab no-caps :icon="Icon.debug" to="/tests">Tests</q-route-tab>
                <q-separator vertical inset />
                <q-route-tab no-caps :icon="Icon.settings" to="/settings">Settings</q-route-tab>
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
