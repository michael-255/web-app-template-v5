<script setup lang="ts">
import { GroupEnum, SettingIdEnum, TagEnum } from '@/shared/enums'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { useQuasar } from 'quasar'
import { computed } from 'vue'

defineProps<{
    group: GroupEnum
}>()

const $q = useQuasar()
const formStore = useFormStore()
const settingsStore = useSettingsStore()

const enabled = onTagToggle(TagEnum.ENABLED)
const favorited = onTagToggle(TagEnum.FAVORITED)
const skipped = onTagToggle(TagEnum.SKIPPED)

/**
 * Returns computed property that toggles tags in selected record for Parent and Child tags.
 */
function onTagToggle(tag: TagEnum) {
    return computed({
        get: () => formStore.record.tags?.includes(tag),
        set: (value) => {
            if (!formStore.record.tags) {
                formStore.record.tags = []
            }
            const index = formStore.record.tags.indexOf(tag)
            if (value && index === -1) {
                formStore.record.tags.push(tag)
            } else if (!value && index !== -1) {
                formStore.record.tags.splice(index, 1)
            }
        },
    })
}
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Settings</q-item-label>

            <q-item-label v-if="!settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)">
                Settings that determine how the app treats this record in certain circumstances.
            </q-item-label>

            <q-list v-if="group === GroupEnum.PARENT" padding>
                <q-item :disable="$q.loading.isActive" tag="label">
                    <q-item-section top>
                        <q-item-label>Enabled</q-item-label>
                        <q-item-label caption> Record is active and visible. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle :disable="$q.loading.isActive" v-model="enabled" size="lg" />
                    </q-item-section>
                </q-item>

                <q-item :disable="$q.loading.isActive" tag="label">
                    <q-item-section top>
                        <q-item-label>Favorited</q-item-label>
                        <q-item-label caption> Record is given priority sorting. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle :disable="$q.loading.isActive" v-model="favorited" size="lg" />
                    </q-item-section>
                </q-item>
            </q-list>

            <q-list v-else-if="group === GroupEnum.CHILD" padding>
                <q-item :disable="$q.loading.isActive" tag="label">
                    <q-item-section top>
                        <q-item-label>Skipped</q-item-label>
                        <q-item-label caption> Record was skipped and is incomplete. </q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-toggle :disable="$q.loading.isActive" v-model="skipped" size="lg" />
                    </q-item-section>
                </q-item>
            </q-list>

            <q-list v-else padding>
                <q-item :disable="$q.loading.isActive" tag="label">
                    <q-item-label> No settings available. </q-item-label>
                </q-item>
            </q-list>
        </q-item-section>
    </q-item>
</template>
