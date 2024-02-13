<script setup lang="ts">
import { examplesIcon, settingsIcon } from '@/shared/icons'
import { RouterView } from 'vue-router'
</script>

<template>
    <q-layout view="hHh LpR lFf">
        <q-header bordered>
            <q-tabs
                class="text-caption header-menu"
                active-color="yellow"
                outside-arrows
                mobile-arrows
            >
                <q-route-tab no-caps :icon="examplesIcon" exact to="/examples">
                    Examples
                </q-route-tab>
                <q-route-tab no-caps :icon="settingsIcon" exact to="/settings">
                    Settings
                </q-route-tab>
            </q-tabs>
        </q-header>

        <q-page-container>
            <RouterView />
        </q-page-container>
    </q-layout>
</template>

<style scoped>
.header-menu {
    height: 50px;
}
</style>
