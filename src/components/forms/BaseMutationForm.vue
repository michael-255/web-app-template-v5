<script setup lang="ts">
import FieldItemChildTags from '@/components/forms/FieldItemChildTags.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemDesc from '@/components/forms/FieldItemDesc.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FieldItemNote from '@/components/forms/FieldItemNote.vue'
import FieldItemParentId from '@/components/forms/FieldItemParentId.vue'
import FieldItemParentTags from '@/components/forms/FieldItemParentTags.vue'
import { DBTableEnum } from '@/shared/enums'

defineProps<{
    table?: DBTableEnum
}>()
</script>

<template>
    <q-form>
        <q-list v-if="table === DBTableEnum.EXAMPLES">
            <FieldItemId />
            <FieldItemCreatedAt />
            <FieldItemName />
            <FieldItemDesc />
            <FieldItemParentTags />
        </q-list>

        <q-list v-else-if="table === DBTableEnum.EXAMPLE_RESULTS">
            <FieldItemParentId />
            <FieldItemId />
            <FieldItemCreatedAt />
            <FieldItemNote />
            <FieldItemChildTags />
        </q-list>

        <q-list v-else>
            <div>Action not supported on this type.</div>
        </q-list>
    </q-form>
</template>
