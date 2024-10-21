<script setup lang="ts">
import useLogger from '@/composables/useLogger'
import { deleteIcon } from '@/shared/icons'
import type { IdType, ServiceType } from '@/shared/types'
import useSettingsStore from '@/stores/settings'
import { useDialogPluginComponent, useQuasar } from 'quasar'
import { computed, ref } from 'vue'

const props = defineProps<{
    id: IdType
    service: ServiceType
    useConfirmationCode: 'ALWAYS' | 'NEVER' | 'ADVANCED-MODE-CONTROLLED'
    confirmationCode?: string
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const settingsStore = useSettingsStore()

/**
 * Converting the code to all uppercase so user doesn't have to worry about case sensitivity.
 * Default confirmation code is 'YES' if no prop is provided.
 */
const confirmationCode = (props.confirmationCode ?? 'YES').toLocaleUpperCase()
const input = ref('')

/**
 * Whether the dialog uses a confirmation code.
 */
const usesConfirmationCode = computed(() => {
    return (
        props.useConfirmationCode === 'ALWAYS' ||
        (props.useConfirmationCode === 'ADVANCED-MODE-CONTROLLED' && !settingsStore.advancedMode)
    )
})

async function onDelete() {
    log.silentDebug('Delete dialog', { id: props.id, service: props.service })
    try {
        $q.loading.show()
        const deletedRecord = await props.service.remove(props.id)
        log.info(`Deleted ${props.service.labelSingular}`, deletedRecord)
    } catch (error) {
        log.error(`Error deleting ${props.service.labelSingular}`, error as Error)
    } finally {
        $q.loading.hide()
        onDialogOK() // Close the dialog at this point
    }
}
</script>

<template>
    <q-dialog ref="dialogRef" @hide="onDialogHide" v-on:keyup.enter="onDelete">
        <q-card class="q-dialog-plugin">
            <q-card-section class="bg-negative text-white q-pt-sm q-pb-xs">
                <q-icon :name="deleteIcon" size="sm" class="q-pb-sm q-mr-md" />
                <span class="text-h6">Delete {{ service.labelSingular }}</span>
            </q-card-section>

            <q-card-section class="q-mt-lg">
                Are you sure you want to delete {{ id }}?
            </q-card-section>

            <q-card-section v-if="usesConfirmationCode">
                Enter "{{ confirmationCode }}" below to unlock this operation.
            </q-card-section>

            <q-card-section v-if="usesConfirmationCode">
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
                    v-if="usesConfirmationCode"
                    :disable="input !== confirmationCode"
                    flat
                    label="Delete"
                    :color="input !== confirmationCode ? 'grey' : 'negative'"
                    @click="onDelete"
                />
                <q-btn v-else flat label="Delete" color="negative" @click="onDelete" />
            </q-card-actions>
        </q-card>
    </q-dialog>
</template>
