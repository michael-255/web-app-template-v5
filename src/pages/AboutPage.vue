<script setup lang="ts">
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - About` })
</script>

<template>
    <h1>About Page</h1>
    <div>
        <q-btn to="/" label="Dashboard" color="primary" />
        <q-btn to="/settings" label="Settings" color="primary" />
    </div>
</template>
