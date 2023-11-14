<script setup lang="ts">
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Settings` })
</script>

<template>
    <q-page padding>
        <h3>Settings Page</h3>
        <div>
            <q-btn to="/" label="Dashboard" color="primary" />
            <q-btn to="/about" label="About" color="primary" />
        </div>
    </q-page>
</template>
