<script setup lang="ts">
import { LimitEnum } from '@/shared/enums'
import { nameSchema } from '@/shared/schemas'
import useSelectedStore from '@/stores/selected'

const selectedStore = useSelectedStore()
</script>

<template>
    <q-item>
        <q-item-section>
            <q-item-label class="text-bold">Name</q-item-label>

            <q-item-label>Customizable name for this record.</q-item-label>

            <q-item-label caption>
                <q-input
                    v-model="selectedStore.record.name"
                    :rules="[
                        (val: string) =>
                            nameSchema.safeParse(val).success ||
                            `Name must be between ${LimitEnum.MIN_NAME} and ${LimitEnum.MAX_NAME} characters`,
                    ]"
                    :maxlength="LimitEnum.MAX_NAME"
                    type="text"
                    lazy-rules
                    counter
                    dense
                    outlined
                    color="primary"
                    @blur="selectedStore.record.name = selectedStore.record.name?.trim()"
                />
            </q-item-label>
        </q-item-section>
    </q-item>
</template>
