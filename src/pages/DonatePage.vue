<script setup lang="ts">
import PageHeading from '@/components/shared/PageHeading.vue'
import ResponsivePage from '@/components/shared/ResponsivePage.vue'
import { Constant, Icon } from '@/shared'
import { useMeta } from 'quasar'

useMeta({ title: `${Constant.AppName} - Donate` })
</script>

<template>
    <ResponsivePage>
        <PageHeading :headingIcon="Icon.donate" headingTitle="Donate" />

        <q-list padding>
            <q-item>
                <q-item-section>
                    <q-item-label>
                        Hope you enjoyed using {{ Constant.AppName }}. I try to create and maintain
                        projects that people find useful. Please consider donating to help me out.
                        Thank you!
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-item-label>
                        Donations are done through <strong>Ko-fi</strong>. It's safe, easy to use,
                        and doesn't require an account.
                    </q-item-label>
                </q-item-section>
            </q-item>

            <q-item>
                <q-item-section>
                    <q-btn
                        class="full-width"
                        color="warning"
                        label="Support me on Ko-fi"
                        target="_blank"
                        href="https://ko-fi.com/michael255"
                        :icon="Icon.web"
                    />
                </q-item-section>
            </q-item>
        </q-list>
    </ResponsivePage>
</template>
