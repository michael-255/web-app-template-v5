<script setup lang="ts">
import { saveIcon } from '@/shared/icons'

defineProps<{
    label: string
    isFormValid: boolean
    isDisabled: boolean
}>()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>
                <div class="row justify-center">
                    <q-btn
                        :label="label"
                        :icon="saveIcon"
                        :disable="isDisabled"
                        color="positive"
                        type="submit"
                    />
                </div>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item v-show="!isFormValid">
        <q-item-section>
            <div class="row justify-center text-warning">
                Correct invalid form entries and try again
            </div>
        </q-item-section>
    </q-item>
</template>
