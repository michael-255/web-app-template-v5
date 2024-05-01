<script setup lang="ts">
import { TagEnum } from '@/shared/enums'
import { saveIcon } from '@/shared/icons'
import useFormStore from '@/stores/form'

defineProps<{
    label: string
}>()

const formStore = useFormStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label>
                <div class="row justify-center">
                    <q-btn
                        :label="label"
                        :icon="saveIcon"
                        :disable="formStore.record?.tags?.includes(TagEnum.LOCKED)"
                        :loading="formStore.loading"
                        color="positive"
                        type="submit"
                    />
                </div>
            </q-item-label>
        </q-item-section>
    </q-item>

    <q-item v-show="!formStore.isValid">
        <q-item-section>
            <div class="row justify-center text-warning">Correct invalid entries and try again</div>
        </q-item-section>
    </q-item>
</template>
