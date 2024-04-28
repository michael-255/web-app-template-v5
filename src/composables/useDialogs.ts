import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogDismiss from '@/components/dialogs/DialogDismiss.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import type { TableEnum } from '@/shared/enums'
import type { ModelType } from '@/shared/types'
import { useQuasar } from 'quasar'
import type { Component } from 'vue'

export default function useDialogs() {
    const $q = useQuasar()

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

    /**
     * Dismissal dialog that displays a message to the user.
     */
    function dismissDialog({
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

    /**
     * Dialog that requires user confirmation before proceeding.
     */
    function confirmDialog({
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
            component: DialogConfirmStrict,
            title,
            message,
            icon,
            color,
            onOk,
        })
    }

    /**
     * Dialog that requires an input code and user confirmation before proceeding.
     */
    function strictConfirmDialog({
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

    /**
     * Fullscreen dialog that provides a human readable view of a record's data.
     */
    function inspectDialog({
        labelSingular,
        labelPlural,
        table,
        record,
    }: {
        labelSingular: string
        labelPlural: string
        table: TableEnum
        record: ModelType
    }) {
        showDialog({ component: DialogInspect, labelSingular, labelPlural, table, record })
    }

    return {
        dismissDialog,
        confirmDialog,
        strictConfirmDialog,
        inspectDialog,
    }
}
