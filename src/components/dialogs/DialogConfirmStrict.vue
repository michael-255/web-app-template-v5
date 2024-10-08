<script setup lang="ts">
import { useDialogPluginComponent } from 'quasar'
import { ref } from 'vue'

const props = defineProps<{
    title: string
    message: string
    color: string
    icon: string
    confirmationText: string
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

// Converting the confirm code text to all uppercase
// User doesn't have to worry about case sensitivity
const confirmationText = props.confirmationText.toLocaleUpperCase()
const input = ref('')
</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDialogOK">
        <q-card class="q-dialog-plugin">
            <q-card-section :class="`bg-${props.color} text-white q-pt-sm q-pb-xs`">
                <q-icon :name="icon" size="sm" class="q-pb-sm q-mr-md" />
                <span class="text-h6">{{ title }}</span>
            </q-card-section>

            <q-card-section class="q-mt-md">{{ message }}</q-card-section>

            <q-card-section>
                Enter "{{ confirmationText }}" below to unlock the confirm button.
            </q-card-section>

            <q-card-section>
                <q-input
                    class="text-h6"
                    autofocus
                    outlined
                    v-model="input"
                    @update:model-value="input = input.toLocaleUpperCase()"
                />
            </q-card-section>

            <q-card-actions align="right">
                <q-btn flat label="Cancel" @click="onDialogCancel" />
                <q-btn
                    :disable="input !== confirmationText"
                    flat
                    label="Confirm"
                    :color="color"
                    @click="onDialogOK"
                />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
