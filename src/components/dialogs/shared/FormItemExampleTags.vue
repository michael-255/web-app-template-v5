<script setup lang="ts">
import { ParentTagEnum } from '@/shared/enums'
import type { ParentTagType } from '@/shared/types'
import useSelectedStore from '@/stores/selected'
import { useQuasar } from 'quasar'
import { computed } from 'vue'
import BaseFormItem from './BaseFormItem.vue'

const $q = useQuasar()
const selectedStore = useSelectedStore()

const enabled = onTagToggle(ParentTagEnum.ENABLED)
const favorited = onTagToggle(ParentTagEnum.FAVORITED)

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: ParentTagType) {
    return computed({
        get: () => selectedStore.example.tags?.includes(tag),
        set: (value) => {
            if (!selectedStore.example.tags) {
                selectedStore.example.tags = []
            }
            const index = selectedStore.example.tags.indexOf(tag)
            if (value && index === -1) {
                selectedStore.example.tags.push(tag)
            } else if (!value && index !== -1) {
                selectedStore.example.tags.splice(index, 1)
            }
        },
    })
}

const isDisabled = computed(() => {
    return $q.loading.isActive || selectedStore.example.tags?.includes(ParentTagEnum.LOCKED)
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
                    <q-item-label>Enabled</q-item-label>
                    <q-item-label caption> Record is active and visible. </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle :disable="isDisabled" v-model="enabled" size="lg" />
                </q-item-section>
            </q-item>

            <q-item :disable="isDisabled" tag="label">
                <q-item-section top>
                    <q-item-label>Favorited</q-item-label>
                    <q-item-label caption> Record is given priority sorting. </q-item-label>
                </q-item-section>

                <q-item-section side>
                    <q-toggle :disable="isDisabled" v-model="favorited" size="lg" />
                </q-item-section>
            </q-item>
        </q-list>
    </BaseFormItem>
</template>
