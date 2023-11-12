<script setup lang="ts">
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Settings` })
</script>

<template>
    <h1>Settings Page</h1>
    <div>
        <q-btn to="/" label="Dashboard" color="primary" />
        <q-btn to="/about" label="About" color="primary" />
    </div>
</template>
