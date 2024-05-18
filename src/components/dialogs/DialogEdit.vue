<script setup lang="ts">
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { SettingIdEnum } from '@/shared/enums'
import { closeIcon, createIcon, saveIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { extend, useDialogPluginComponent, useQuasar } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogOK, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const $q = useQuasar()
const { log } = useLogger()
const { onConfirmDialog } = useDialogs()
const formStore = useFormStore()
const settingsStore = useSettingsStore()
const service = DatabaseManager.getService(formStore.record.id)

onUnmounted(() => {
    formStore.$reset()
})

async function onEditSubmit() {
    if (settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)) {
        return await editSubmit()
    } else {
        onConfirmDialog({
            title: 'Update Record',
            message: 'Are you sure you want to update this record?',
            color: 'positive',
            icon: saveIcon,
            onOk: async () => {
                return await editSubmit()
            },
        })
    }
}

async function editSubmit() {
    try {
        $q.loading.show()
        const editRecord = extend(true, {}, formStore.record) as ModelType
        await service.put(DB, editRecord)
        log.info('Record updated', editRecord)
    } catch (error) {
        log.error(`Error updating record`, error as Error)
    } finally {
        $q.loading.hide()
        onDialogOK()
    }
}
</script>

<template>
    <q-dialog
        ref="dialogRef"
        transition-show="slide-up"
        transition-hide="slide-down"
        maximized
        @hide="onDialogHide"
    >
        <q-toolbar class="bg-info text-white toolbar-height">
            <q-icon :name="createIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Edit {{ service.labelSingular }}</q-toolbar-title>
            <q-btn
                flat
                round
                :icon="closeIcon"
                :disable="$q.loading.isActive"
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
