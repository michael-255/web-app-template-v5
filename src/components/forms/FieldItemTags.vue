<script setup lang="ts">
import { TagEnum } from '@/shared/enums'
import useSelectedStore from '@/stores/selected'
import { computed } from 'vue'

defineProps<{
    group: 'Parent' | 'Child'
}>()

const selectedStore = useSelectedStore()

const enabled = onTagToggle(TagEnum.ENABLED)
const favorited = onTagToggle(TagEnum.FAVORITED)
const skipped = onTagToggle(TagEnum.SKIPPED)

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: TagEnum) {
    return computed({
        get: () => selectedStore.record.tags?.includes(tag),
        set: (value) => {
            if (!selectedStore.record.tags) {
                selectedStore.record.tags = []
            }
            const index = selectedStore.record.tags.indexOf(tag)
            if (value && index === -1) {
                selectedStore.record.tags.push(tag)
            } else if (!value && index !== -1) {
                selectedStore.record.tags.splice(index, 1)
            }
        },
    })
}
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Settings</q-item-label>

            <q-item-label>
                Settings that determine how the app treats this record in certain circumstances.
            </q-item-label>

            <q-list v-if="group === 'Parent'" padding>
                <q-item tag="label" v-ripple>
                    <q-item-section top>
                        <q-item-label>Enabled</q-item-label>
                        <q-item-label caption> Record is active and visible. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle v-model="enabled" size="lg" />
                    </q-item-section>
                </q-item>

                <q-item tag="label" v-ripple>
                    <q-item-section top>
                        <q-item-label>Favorited</q-item-label>
                        <q-item-label caption> Record is given priority sorting. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle v-model="favorited" size="lg" />
                    </q-item-section>
                </q-item>
            </q-list>

            <q-list v-else padding>
                <q-item tag="label" v-ripple>
                    <q-item-section top>
                        <q-item-label>Skipped</q-item-label>
                        <q-item-label caption> Record was skipped and is incomplete. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle v-model="skipped" size="lg" />
                    </q-item-section>
                </q-item>
            </q-list>
        </q-item-section>
    </q-item>
</template>