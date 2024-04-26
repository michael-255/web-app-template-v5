<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemDesc from '@/components/forms/FieldItemDesc.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FieldItemNote from '@/components/forms/FieldItemNote.vue'
import FieldItemParentId from '@/components/forms/FieldItemParentId.vue'
import FieldItemTags from '@/components/forms/FieldItemTags.vue'
import FormSubmitButton from '@/components/forms/FormSubmitButton.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import { TableEnum } from '@/shared/enums'
import { editIcon, saveIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { extend, useMeta, useQuasar } from 'quasar'
import { onMounted, onUnmounted, ref } from 'vue'

useMeta({ title: `${appName} - Edit` })

const $q = useQuasar()
const { routeTable, routeId, goBack } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()

const isFormValid = ref(true)
const service = DatabaseManager.getService(routeTable!)

onMounted(async () => {
    try {
        // Making deep copies to avoid reactivity issues
        extend(true, selectedStore.record, await service.get(DB, routeId!))
    } catch (error) {
        log.error('Error loading Edit page', error as Error)
    }
})

onUnmounted(() => {
    selectedStore.$reset()
})

function onEditSubmit() {
    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Update Record',
            message: 'Are you sure you want to update this record?',
            color: 'positive',
            icon: saveIcon,
        },
    }).onOk(async () => {
        try {
            const editRecord = extend(true, {}, selectedStore.record) as ModelType
            await service.put(DB, editRecord)
            log.info('Record updated', editRecord)
            goBack()
        } catch (error) {
            log.error(`Error updating record`, error as Error)
        }
    })
}
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="editIcon" :headingTitle="`Edit ${service.labelSingular}`" />

        <q-form
            @submit.prevent="onEditSubmit()"
            @validation-error="isFormValid = false"
            @validation-success="isFormValid = true"
        >
            <q-list v-if="routeTable === TableEnum.EXAMPLES">
                <FieldItemId />
                <FieldItemCreatedAt />
                <FieldItemName />
                <FieldItemDesc />
                <FieldItemTags group="Parent" />
                <FormSubmitButton label="Update Record" :isFormValid="isFormValid" />
            </q-list>

            <q-list v-else-if="routeTable === TableEnum.EXAMPLE_RESULTS">
                <FieldItemId />
                <FieldItemParentId mutation="Edit" />
                <FieldItemCreatedAt />
                <FieldItemNote />
                <FieldItemTags group="Child" />
                <FormSubmitButton label="Update Record" :isFormValid="isFormValid" />
            </q-list>

            <q-list v-else>
                <div>Edit not supported on {{ service.labelPlural }} table</div>
            </q-list>
        </q-form>
    </ResponsivePage>
</template>
