<script setup lang="ts">
import { ChildTagEnum } from '@/shared/enums'
import type { ChildTagType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const skipped = onTagToggle(ChildTagEnum.SKIPPED)

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: ChildTagType) {
    return computed({
        get: () => selectedStore.exampleResult.tags?.includes(tag),
        set: (value) => {
            if (!selectedStore.exampleResult.tags) {
                selectedStore.exampleResult.tags = []
            }
            const index = selectedStore.exampleResult.tags.indexOf(tag)
            if (value && index === -1) {
                selectedStore.exampleResult.tags.push(tag)
            } else if (!value && index !== -1) {
                selectedStore.exampleResult.tags.splice(index, 1)
            }
        },
    })
}

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.exampleResult.tags?.includes(ChildTagEnum.LOCKED)
})
</script>

<template>
    <BaseFormItem
        label="Tags"
        description="Options that determine how the app treats this record in certain circumstances."
    >
        <q-list padding>
            <q-item :disable="isDisabled" tag="label">
                <q-item-section top>
                    <q-item-label>Skipped</q-item-label>
                    <q-item-label caption> Record was skipped and is incomplete. </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle :disable="isDisabled" v-model="skipped" size="lg" />
                </q-item-section>
            </q-item>
        </q-list>
    </BaseFormItem>
</template>
