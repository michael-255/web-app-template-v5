<script setup lang="ts">
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - 404 Not Found` })
</script>

<template>
    <h1>404 Not Found</h1>
    <div>
        <q-btn to="/" label="Dashboard" color="primary" />
        <q-btn to="/settings" label="Settings" color="primary" />
        <q-btn to="/about" label="About" color="primary" />
    </div>
</template>
