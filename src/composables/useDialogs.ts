import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogDismiss from '@/components/dialogs/DialogDismiss.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useLogger from '@/composables/useLogger'
import DatabaseManager from '@/services/DatabaseManager'
import DB from '@/services/db'
import { SettingIdEnum, type TableEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import useFormStore from '@/stores/form'
import useSettingsStore from '@/stores/settings'
import { extend, useQuasar } from 'quasar'
import type { Component } from 'vue'

export default function useDialogs() {
    const $q = useQuasar()
    const { log } = useLogger()
    const formStore = useFormStore()
    const settingsStore = useSettingsStore()

    /**
     * Helper function that dislays the dialog with the provided component and props.
     */
    function showDialog({
        component,
        onOk,
        onCancel,
        onDismiss,
        ...props
    }: {
        component: Component
        onOk?: () => Promise<void>
        onCancel?: () => Promise<void>
        onDismiss?: () => Promise<void>
        [key: string]: any
    }) {
        $q.dialog({
            component,
            componentProps: {
                ...props,
            },
        })
            .onOk(async () => {
                if (onOk) await onOk()
            })
            .onCancel(async () => {
                if (onCancel) await onCancel()
            })
            .onDismiss(async () => {
                if (onDismiss) await onDismiss()
            })
    }

    function onDismissDialog({
        title,
        message,
        icon,
        color,
    }: {
        title: string
        message: string
        icon: string
        color: string
    }) {
        showDialog({ component: DialogDismiss, title, message, icon, color })
    }

    function onConfirmDialog({
        title,
        message,
        icon,
        color,
        onOk,
    }: {
        title: string
        message: string
        icon: string
        color: string
        onOk: () => Promise<void>
    }) {
        showDialog({
            component: DialogConfirm,
            title,
            message,
            icon,
            color,
            onOk,
        })
    }

    function onStrictConfirmDialog({
        title,
        message,
        icon,
        color,
        confirmCode = 'YES',
        onOk,
    }: {
        title: string
        message: string
        icon: string
        color: string
        confirmCode?: string
        onOk: () => Promise<void>
    }) {
        showDialog({
            component: DialogConfirmStrict,
            title,
            message,
            icon,
            color,
            confirmCode,
            onOk,
        })
    }

    async function onInspectDialog(id: IdType) {
        const service = DatabaseManager.getService(id)
        // Making deep copies to avoid frontend reactivity issues with proxies
        extend(true, formStore.record, await service.get(DB, id))
        showDialog({ component: DialogInspect })
    }

    function onCreateDialog(table: TableEnum, parentId?: IdType) {
        const service = DatabaseManager.getService(table)

        if (parentId) {
            formStore.record = new service.Model({ parentId } as any)
        } else {
            formStore.record = new service.Model({} as any)
        }

        showDialog({ component: DialogCreate })
    }

    async function onEditDialog(id: IdType) {
        const service = DatabaseManager.getService(id)
        // Making deep copies to avoid frontend reactivity issues with proxies
        extend(true, formStore.record, await service.get(DB, id))
        showDialog({ component: DialogEdit })
    }

    function onDeleteDialog(id: IdType) {
        const title = 'Delete Record'
        const message = `Are you sure you want to delete ${id}?`
        const color = 'negative'
        const icon = deleteIcon

        if (settingsStore.getSettingValue(SettingIdEnum.ADVANCED_MODE)) {
            return onConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await deleteDialog(id)
                },
            })
        } else {
            onStrictConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await deleteDialog(id)
                },
            })
        }
    }

    async function deleteDialog(id: IdType) {
        try {
            $q.loading.show()
            const service = DatabaseManager.getService(id)
            const deletedRecord = await service.delete(DB, id)
            log.info(`Deleted record`, deletedRecord)
        } catch (error) {
            log.error(`Error deleting record`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    // TODO: Implement charts dialog
    function onChartsDialog(id: IdType) {
        log.warn('Charts dialog not implemented', { id })
    }

    return {
        onDismissDialog,
        onConfirmDialog,
        onStrictConfirmDialog,
        onInspectDialog,
        onCreateDialog,
        onEditDialog,
        onDeleteDialog,
        onChartsDialog,
    }
}
