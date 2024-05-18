<script setup lang="ts">
import DatabaseManager from '@/services/DatabaseManager'
import { closeIcon, inspectIcon } from '@/shared/icons'
import useFormStore from '@/stores/form'
import { useDialogPluginComponent } from 'quasar'
import { onUnmounted } from 'vue'

defineEmits([...useDialogPluginComponent.emits])
const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent()

const formStore = useFormStore()
const service = DatabaseManager.getService(formStore.record.id)

onUnmounted(() => {
    formStore.$reset()
})
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
                        <div v-if="service.inspectComponents().length > 0">
                            <q-list
                                v-for="(item, i) in service.inspectComponents()"
                                :key="i"
                                padding
                            >
                                <component :is="item.component" v-bind="item?.props" />
                            </q-list>
                        </div>

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
