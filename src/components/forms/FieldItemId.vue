<script setup lang="ts">
import { SettingIdEnum } from '@/shared/enums'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'

const formStore = useFormStore()
const settingsStore = useSettingsStore()
</script>

<template>
    <q-item class="q-mb-md">
        <q-item-section>
            <q-item-label class="text-bold">Id</q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                An auto generated value that uniquely identifies this record in the database.
            </q-item-label>

            <q-item-label caption>
                {{ formStore.record?.id ?? '-' }}
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
