<script setup lang="ts">
import { Icon } from '@/shared'
import { RouterView } from 'vue-router'
</script>

<template>
    <q-layout view="hHh LpR lFf">
        <q-header bordered>
            <q-tabs class="text-caption" active-color="yellow" outside-arrows mobile-arrows>
                <q-route-tab no-caps :icon="Icon.examples" to="/">Examples</q-route-tab>
                <q-route-tab no-caps :icon="Icon.debug" to="/tests">Tests</q-route-tab>
                <q-route-tab no-caps :icon="Icon.settings" to="/settings">Settings</q-route-tab>
            </q-tabs>
        </q-header>

        <q-page-container>
            <router-view />

            <q-page-scroller position="bottom">
                <q-btn fab :icon="Icon.topOfPage" color="accent" />
            </q-page-scroller>
        </q-page-container>
    </q-layout>
</template>
