<script setup lang="ts">
import Setting from '@/models/Setting'
import DB from '@/services/Database'
import SettingService from '@/services/SettingService'
import { appDescription, appName } from '@/shared/constants'
import { SettingIdEnum } from '@/shared/enums'
import {
    childTableIcon,
    donatePageIcon,
    favoriteOffIcon,
    favoriteOnIcon,
    menuIcon,
    parentTableIcon,
    recommendIcon,
} from '@/shared/icons'
import useSettingsStore from '@/stores/settings'
import { onMounted, ref, type Ref } from 'vue'

const settingsStore = useSettingsStore()

const exampleFavorite: Ref<number> = ref(0)
const showWelcome: Ref<any> = ref(false)

onMounted(async () => {
    showWelcome.value = Boolean(settingsStore.getSettingValue(SettingIdEnum.INSTRUCTIONS_OVERLAY))
})

async function onCloseWelcomeOverlay() {
    await SettingService.put(
        DB,
        new Setting({
            id: SettingIdEnum.INSTRUCTIONS_OVERLAY,
            value: false,
        }),
    )
    showWelcome.value = false
}
</script>

<template>
    <q-dialog v-model="showWelcome" persistent>
        <q-card flat square>
            <q-card-section>
                <p class="text-h6">Welcome to {{ appName }}</p>

                <p>{{ appDescription }}</p>

                <p>
                    Continue reading to learn more, or scroll to the bottom and click the "Start
                    Using App" button to jump right in.
                </p>

                <div class="q-mb-md">
                    <p>
                        You are currently on the Dashboard page. This page gives you quick access to
                        the primary data you work with in the app. You can favorite items on the
                        Dashboard by clicking the star icon in the top right corner of the item.
                        This prioritizes the item to the top of the list.
                    </p>
                    <q-rating
                        v-model="exampleFavorite"
                        :max="1"
                        :icon="favoriteOffIcon"
                        :icon-selected="favoriteOnIcon"
                        color="warning"
                        size="md"
                    />
                </div>

                <div class="q-mb-md">
                    <p>
                        You can navigate through the app using the menu in the top left corner of
                        the page. An example of the menu button is below. The menu gives you access
                        to the primary data tables, Frequently Asked Questions (FAQ), Settings, and
                        more. More advanced operations for the app are available on the Settings
                        page.
                    </p>
                    <q-btn disable color="primary" class="q-px-sm" :icon="menuIcon" />
                </div>

                <div class="q-mb-md">
                    <p>
                        You can access the data tables for the current Dashboard selection by
                        clicking the buttons in the top right corner of the page. The left button is
                        for the parent record-s. The right button is for the child record-s.
                    </p>
                    <q-btn disable color="info" class="q-px-sm q-mr-sm" :icon="parentTableIcon" />
                    <q-btn disable color="info" class="q-px-sm" :icon="childTableIcon" />
                </div>

                <div class="q-mb-md">
                    <p>
                        Hope you find {{ appName }} useful. Please consider donating to help me
                        continue to create and maintain apps like this. Thank you!
                    </p>
                    <q-btn color="warning" label="Donate" to="/donate" :icon="donatePageIcon" />
                </div>

                <div>
                    <p>Click the button below when you are ready to get started.</p>
                    <q-btn
                        no-caps
                        label="Start Using App"
                        class="full-width"
                        size="lg"
                        color="positive"
                        :icon="recommendIcon"
                        @click="onCloseWelcomeOverlay()"
                    />
                </div>
            </q-card-section>
        </q-card>
    </q-dialog>
</template>
