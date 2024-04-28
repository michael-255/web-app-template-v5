<script setup lang="ts">
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
import useDialogs from '@/composables/useDialogs'
import useLogger from '@/composables/useLogger'
import useRouting from '@/composables/useRouting'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { appName } from '@/shared/constants'
import { GroupEnum, TableEnum } from '@/shared/enums'
import { createIcon, saveIcon } from '@/shared/icons'
import type { ModelType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { extend, useMeta } from 'quasar'
import { onMounted, onUnmounted } from 'vue'

useMeta({ title: `${appName} - Create` })

const { routeTable, routeParentId, goBack } = useRouting()
const selectedStore = useSelectedStore()
const { log } = useLogger()
const { confirmDialog } = useDialogs()

const service = DatabaseManager.getService(routeTable!)

onMounted(async () => {
    try {
        if (routeParentId) {
            selectedStore.record = new service.Model({ parentId: routeParentId } as any)
        } else {
            selectedStore.record = new service.Model({} as any)
        }
    } catch (error) {
        log.error('Error loading Create page', error as Error)
    }
})

onUnmounted(() => {
    selectedStore.$reset() // TODO: Will be `onDismiss` function for dialogs
})

function onCreateSubmit() {
    confirmDialog({
        title: 'Create Record',
        message: 'Are you sure you want to create this record?',
        color: 'positive',
        icon: saveIcon,
        onOk: async () => {
            try {
                // TODO: Make notification that says something is loading and dismis it in fainally
                // $q.notify({ message: 'Loading...', color: 'secondary', timeout: 0, position: 'bottom' })
                selectedStore.loading = true
                const newRecord = extend(true, {}, selectedStore.record) as ModelType
                await service.add(DB, newRecord)
                log.info('Record created', newRecord)

                // wait for 8 seconds
                await new Promise((resolve) => setTimeout(resolve, 5000))
            } catch (error) {
                log.error(`Error creating record`, error as Error)
            } finally {
                selectedStore.loading = false
                goBack()
            }
        },
    })
}
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="createIcon" :headingTitle="`Create ${service.labelSingular}`" />

        <q-form
            @submit.prevent="onCreateSubmit"
            @validation-error="selectedStore.isValid = false"
            @validation-success="selectedStore.isValid = true"
        >
            <q-list v-if="routeTable === TableEnum.EXAMPLES">
                <FieldItemId />
                <FieldItemCreatedAt />
                <FieldItemName />
                <FieldItemDesc />
                <FieldItemTags :group="GroupEnum.PARENT" />
                <FormSubmitButton label="Create Record" />
            </q-list>

            <q-list v-else-if="routeTable === TableEnum.EXAMPLE_RESULTS">
                <FieldItemId />
                <FieldItemParentId mutation="Create" />
                <FieldItemCreatedAt />
                <FieldItemNote />
                <FieldItemTags :group="GroupEnum.CHILD" />
                <FormSubmitButton label="Create Record" />
            </q-list>

            <q-list v-else>
                <div>Create not supported on {{ service.labelPlural }} table</div>
            </q-list>
        </q-form>
    </ResponsivePage>
</template>
