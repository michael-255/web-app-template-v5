<script setup lang="ts">
import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import FieldItemChildTags from '@/components/forms/FieldItemChildTags.vue'
import FieldItemCreateParentId from '@/components/forms/FieldItemCreateParentId.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemDesc from '@/components/forms/FieldItemDesc.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FieldItemNote from '@/components/forms/FieldItemNote.vue'
import FieldItemParentTags from '@/components/forms/FieldItemParentTags.vue'
import FieldItemSubmitButton from '@/components/forms/FieldItemSubmitButton.vue'
import useLogger from '@/composables/useLogger'
import { DBTableEnum } from '@/shared/enums'
import { saveIcon } from '@/shared/icons'
import { useQuasar } from 'quasar'
import { ref } from 'vue'

const props = defineProps<{
    table?: DBTableEnum
    mutation: 'Create' | 'Edit'
}>()

const $q = useQuasar()
const { log } = useLogger()

const isFormValid = ref(true)

function onSubmitMutationForm() {
    $q.dialog({
        component: DialogConfirm,
        componentProps: {
            title: `${props.mutation} Record`,
            message: `Are you sure you want to ${props.mutation.toLowerCase()} this record?`,
            color: 'positive',
            icon: saveIcon,
        },
    }).onOk(async () => {
        try {
            // TODO
            log.info('Successfully submitted form', {
                table: props.table,
                mutation: props.mutation,
                record: '',
            })
        } catch (error) {
            log.error(`Error during submission`, error as Error)
        }
    })
}
</script>

<template>
    <q-form
        @submit="onSubmitMutationForm()"
        @validation-error="isFormValid = false"
        @validation-success="isFormValid = true"
    >
        <q-list v-if="table === DBTableEnum.EXAMPLES">
            <FieldItemId />
            <FieldItemCreatedAt />
            <FieldItemName />
            <FieldItemDesc />
            <FieldItemParentTags />
            <FieldItemSubmitButton :mutation="mutation" />
        </q-list>

        <q-list v-else-if="table === DBTableEnum.EXAMPLE_RESULTS">
            <FieldItemCreateParentId />
            <FieldItemId />
            <FieldItemCreatedAt />
            <FieldItemNote />
            <FieldItemChildTags />
            <FieldItemSubmitButton :mutation="mutation" />
        </q-list>

        <q-list v-else>
            <div>Action not supported on table: {{ table }}</div>
        </q-list>
    </q-form>
</template>
