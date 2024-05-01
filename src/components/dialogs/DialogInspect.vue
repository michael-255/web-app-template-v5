<script setup lang="ts">
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import DatabaseManager from '@/services/DatabaseManager'
import { TableEnum } from '@/shared/enums'
import { closeIcon, inspectIcon } from '@/shared/icons'
import useFormStore from '@/stores/form'
import { useDialogPluginComponent } from 'quasar'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const formStore = useFormStore()
const service = DatabaseManager.getService(formStore.record.id)
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
            <q-icon :name="inspectIcon" size="sm" class="q-mx-sm" />
            <q-toolbar-title>Inspect {{ service.labelSingular }}</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list v-if="service.table === TableEnum.LOGS" padding>
                            <InspectItemDefault name="Id" :value="formStore.record.id" />
                            <InspectItemDate
                                name="Created Date"
                                :value="formStore.record.createdAt"
                            />
                            <InspectItemDefault
                                name="Log Level"
                                :value="formStore.record.logLevel"
                            />
                            <InspectItemDefault name="Label" :value="formStore.record.label" />
                            <InspectItemObject name="Details" :value="formStore.record.details" />
                        </q-list>

                        <q-list v-else-if="service.table === TableEnum.EXAMPLES" padding>
                            <InspectItemDefault name="Id" :value="formStore.record.id" />
                            <InspectItemDate
                                name="Created Date"
                                :value="formStore.record.createdAt"
                            />
                            <InspectItemDefault name="Name" :value="formStore.record.name" />
                            <InspectItemDefault name="Description" :value="formStore.record.desc" />
                            <InspectItemArray name="Tags" :value="formStore.record.tags" />
                            <InspectItemObject
                                name="Last Example Result"
                                :value="formStore.record.lastChild"
                            />
                        </q-list>

                        <q-list v-else-if="service.table === TableEnum.EXAMPLE_RESULTS" padding>
                            <InspectItemDefault name="Id" :value="formStore.record.id" />
                            <InspectItemDate
                                name="Created Date"
                                :value="formStore.record.createdAt"
                            />
                            <InspectItemDefault
                                name="Example Id"
                                :value="formStore.record.parentId"
                            />
                            <InspectItemDefault name="Notes" :value="formStore.record.note" />
                            <InspectItemArray name="Tags" :value="formStore.record.tags" />
                        </q-list>

                        <q-list v-else padding>
                            <div>Inspect not supported on {{ service.labelPlural }} table</div>
                        </q-list>
                        <div class="q-mt-xl" />
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
