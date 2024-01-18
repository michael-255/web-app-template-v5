<script setup lang="ts">
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { Constant } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - 404 Not Found` })
</script>

<template>
    <ResponsivePage>
        <q-card flat>
            <q-card-section>
                <div class="text-h3">404</div>
                <div class="text-subtitle1">Page Not Found</div>
            </q-card-section>
        </q-card>
    </ResponsivePage>
</template>
