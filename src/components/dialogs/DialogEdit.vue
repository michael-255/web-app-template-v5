<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import useFormStore from '@/stores/form'
import { extend, useDialogPluginComponent } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogCancel } = useDialogPluginComponent()

const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const formStore = useFormStore()
const service = DatabaseManager.getService(formStore.record.id)

onUnmounted(() => {
    formStore.$reset()
})

function onEditSubmit() {
    onConfirmDialog({
        title: 'Update Record',
        message: 'Are you sure you want to update this record?',
        color: 'positive',
        icon: saveIcon,
        onOk: async () => {
            try {
                const editRecord = extend(true, {}, formStore.record) as ModelType
                await service.put(DB, editRecord)
                log.info('Record updated', editRecord)
            } catch (error) {
                log.error(`Error updating record`, error as Error)
            } finally {
                formStore.isLoading = false
                onDialogOK()
            }
        },
    })
}
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        persistent
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="createIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Edit {{ service.labelSingular }}</q-toolbar-title>
            <q-btn
                flat
                round
                :icon="closeIcon"
                :disable="formStore.isLoading"
                @click="onDialogCancel"
            />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-form
                            v-if="service.formComponents('Edit').length > 0"
                            @submit.prevent="onEditSubmit"
                            @validation-error="formStore.isValid = false"
                            @validation-success="formStore.isValid = true"
                            class="q-mb-xl"
                        >
                            <q-list
                                v-for="(item, i) in service.formComponents('Edit')"
                                :key="i"
                                padding
                            >
                                <component :is="item.component" v-bind="item?.props" />
                            </q-list>
                        </q-form>

                        <q-list v-else padding>
                            <div>Edit not supported on {{ service.labelPlural }} table</div>
                        </q-list>
                    </div>
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>

<style scoped>
.toolbar-height {
    max-height: 50px;
}
.responsive-container {
    width: 100%;
    max-width: 800px;
}
</style>
