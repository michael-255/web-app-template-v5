<script setup lang="ts">
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - About` })
</script>

<template>
    <q-page padding>
        <h3>About Page</h3>
        <div>
            <q-btn to="/" label="Dashboard" color="primary" />
            <q-btn to="/settings" label="Settings" color="primary" />
        </div>
    </q-page>
</template>
