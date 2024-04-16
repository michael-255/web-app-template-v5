<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import FieldItemChildTags from '@/components/forms/FieldItemChildTags.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemDesc from '@/components/forms/FieldItemDesc.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FieldItemNote from '@/components/forms/FieldItemNote.vue'
import FieldItemParentId from '@/components/forms/FieldItemParentId.vue'
import FieldItemParentTags from '@/components/forms/FieldItemParentTags.vue'
import FormSubmitButton from '@/components/forms/FormSubmitButton.vue'
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import DB from '@/services/Database'
import { appName } from '@/shared/constants'
import { DBTableEnum } from '@/shared/enums'
import { createIcon, saveIcon } from '@/shared/icons'
import type { DBRecordType } from '@/shared/types'
import { getTableLabel } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import { extend, useMeta, useQuasar } from 'quasar'
import { onMounted, onUnmounted, ref } from 'vue'

useMeta({ title: `${appName} - Create` })

const $q = useQuasar()
const { routeTable, routeParentId, goBack } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()

const isFormValid = ref(true)

onMounted(async () => {
    switch (routeTable) {
        case DBTableEnum.EXAMPLES:
            selectedStore.record = new Example()
            break
        case DBTableEnum.EXAMPLE_RESULTS:
            selectedStore.record = new ExampleResult({ parentId: routeParentId })
            break
        default:
            log.error('Create not supported on table', { routeTable })
            break
    }
})

onUnmounted(() => {
    selectedStore.$reset()
})

function onCreateSubmit() {
    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: 'Create Record',
            message: 'Are you sure you want to create this record?',
            color: 'positive',
            icon: saveIcon,
        },
    }).onOk(async () => {
        try {
            const newRecord = extend(true, {}, selectedStore.record)

            await DB.createRecord(routeTable as DBTableEnum, newRecord as DBRecordType)

            log.info('Record created', { table: routeTable, newRecord })

            goBack()
        } catch (error) {
            log.error(`Error creating record`, error as Error)
        }
    })
}
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading
            :headingIcon="createIcon"
            :headingTitle="`Create ${getTableLabel(routeTable)}`"
        />

        <q-form
            @submit="onCreateSubmit()"
            @validation-error="isFormValid = false"
            @validation-success="isFormValid = true"
        >
            <q-list v-if="routeTable === DBTableEnum.EXAMPLES">
                <FieldItemId />
                <FieldItemCreatedAt />
                <FieldItemName />
                <FieldItemDesc />
                <FieldItemParentTags />
                <FormSubmitButton label="Create Record" :isFormValid="isFormValid" />
            </q-list>

            <q-list v-else-if="routeTable === DBTableEnum.EXAMPLE_RESULTS">
                <FieldItemId />
                <FieldItemParentId mutation="Create" />
                <FieldItemCreatedAt />
                <FieldItemNote />
                <FieldItemChildTags />
                <FormSubmitButton label="Create Record" :isFormValid="isFormValid" />
            </q-list>

            <q-list v-else>
                <div>Create not supported on table: {{ routeTable }}</div>
            </q-list>
        </q-form>
    </ResponsivePage>
</template>
