<script setup lang="ts">
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import { DBTableEnum } from '@/shared/enums'

defineProps<{
    table?: DBTableEnum
}>()
</script>

<template>
    <q-form>
        <q-list v-if="table === DBTableEnum.EXAMPLES">
            <FieldItemId />
            <FieldItemName />
        </q-list>

        <q-list v-else-if="table === DBTableEnum.EXAMPLE_RESULTS">
            <FieldItemId />
        </q-list>

        <q-list v-else>
            <div>Action not supported on this type.</div>
        </q-list>
    </q-form>
</template>
