<script setup lang="ts">
import { TagEnum } from '@/shared/enums'
import { saveIcon } from '@/shared/icons'
import useSelectedStore from '@/stores/selected'

defineProps<{
    label: string
}>()

const selectedStore = useSelectedStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>
                <div class="row justify-center">
                    <q-btn
                        :label="label"
                        :icon="saveIcon"
                        :disable="selectedStore.record?.tags?.includes(TagEnum.LOCKED)"
                        :loading="selectedStore.loading"
                        color="positive"
                        type="submit"
                    />
                </div>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item v-show="!selectedStore.isValid">
        <q-item-section>
            <div class="row justify-center text-warning">Correct invalid entries and try again</div>
        </q-item-section>
    </q-item>
</template>
