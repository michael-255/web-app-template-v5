<script setup lang="ts">
import FabGoBack from '@/components/shared/FabGoBack.vue'
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - About` })
</script>

<template>
    <ResponsivePage>
        <FabGoBack />
        <PageHeading :headingIcon="Icon.info" headingTitle="About" />

        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label>
                        {{ Constant.AppDescription }}
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>
                        Feel free to checkout my other projects or help support my work with a
                        donation. Thanks for visiting!
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="primary"
                        label="GitHub"
                        target="_blank"
                        href="https://github.com/michael-255"
                        :icon="Icon.code"
                    />
                </q-item-section>

                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="warning"
                        label="Donate"
                        to="/donate"
                        :icon="Icon.donate"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
