<script setup lang="ts">
import InspectItemArray from '@/components/dialogs/inspect/InspectItemArray.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemDefault from '@/components/dialogs/inspect/InspectItemDefault.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import { TableEnum } from '@/shared/enums'
import { closeIcon, inspectIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import { useDialogPluginComponent } from 'quasar'

/**
 * These props are being used because I can't find a way to asyncronously load the record within
 * the setup function without causing issues. I'm unable to wrap the dialog in a `Suspense`
 * component that could do this due to not knowing where Quasar is loading the dialog from.
 *
 * It's also worth noting that creating empty refs and then doing the asyncronous loading in the
 * `onMounted` lifecycle hook would also cause display issues.
 */
defineProps<{
    labelSingular: string
    labelPlural: string
    table: TableEnum
    record: ModelType
}>()

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()
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
            <q-toolbar-title>Inspect {{ labelSingular }}</q-toolbar-title>
            <q-btn flat round :icon="closeIcon" @click="onDialogCancel" />
        </q-toolbar>

        <q-card class="q-dialog-plugin">
            <q-card-section>
                <div class="row justify-center">
                    <div class="responsive-container">
                        <q-list v-if="table === TableEnum.LOGS" padding>
                            <InspectItemDefault name="Id" :value="record.id" />
                            <InspectItemDate name="Created Date" :value="record.createdAt" />
                            <InspectItemDefault name="Log Level" :value="record.logLevel" />
                            <InspectItemDefault name="Label" :value="record.label" />
                            <InspectItemObject name="Details" :value="record.details" />
                        </q-list>

                        <q-list v-else-if="table === TableEnum.EXAMPLES" padding>
                            <InspectItemDefault name="Id" :value="record.id" />
                            <InspectItemDate name="Created Date" :value="record.createdAt" />
                            <InspectItemDefault name="Name" :value="record.name" />
                            <InspectItemDefault name="Description" :value="record.desc" />
                            <InspectItemArray name="Tags" :value="record.tags" />
                            <InspectItemObject
                                name="Last Example Result"
                                :value="record.lastChild"
                            />
                        </q-list>

                        <q-list v-else-if="table === TableEnum.EXAMPLE_RESULTS" padding>
                            <InspectItemDefault name="Id" :value="record.id" />
                            <InspectItemDate name="Created Date" :value="record.createdAt" />
                            <InspectItemDefault name="Example Id" :value="record.parentId" />
                            <InspectItemDefault name="Notes" :value="record.note" />
                            <InspectItemArray name="Tags" :value="record.tags" />
                        </q-list>

                        <q-list v-else padding>
                            <div>Inspect not supported on {{ labelPlural }} table</div>
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
