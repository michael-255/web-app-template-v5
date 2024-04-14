<script setup lang="ts">
import { saveIcon } from '@/shared/icons'

defineProps<{
    label: string
}>()
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label>
                <div class="row justify-center">
                    <q-btn :label="label" :icon="saveIcon" color="positive" type="submit" />
                </div>
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
