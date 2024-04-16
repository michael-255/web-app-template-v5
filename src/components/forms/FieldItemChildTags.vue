<script setup lang="ts">
import useActions from '@/composables/useActions'
import { TagEnum } from '@/shared/enums'

const { onTagToggle } = useActions()

const skipped = onTagToggle(TagEnum.SKIPPED)
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Settings</q-item-label>

            <q-item-label>
                Settings that determine how the app treats this record in certain circumstances.
            </q-item-label>

            <q-list padding>
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
