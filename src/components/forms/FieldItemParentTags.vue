<script setup lang="ts">
import useActions from '@/composables/useActions'
import { ParentTagEnum } from '@/shared/enums'

const { onTagToggle } = useActions()

const enabled = onTagToggle(ParentTagEnum.ENABLED)
const favorited = onTagToggle(ParentTagEnum.FAVORITED)
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Settings</q-item-label>

            <q-item-label>
                Determine how the app treats the record in certain circumstances.
            </q-item-label>

            <q-list padding>
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
        </q-item-section>
    </q-item>
</template>
