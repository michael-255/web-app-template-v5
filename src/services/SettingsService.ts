import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import InspectItemBoolean from '@/components/dialogs/inspect/InspectItemBoolean.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import { settingsSchema } from '@/models/Settings'
import { TableEnum } from '@/shared/enums'
import { settingsPageIcon, settingsTableIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import type { QDialogOptions } from 'quasar'
import { BaseService } from './BaseService'

export class SettingsService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'App Settings'
    labelPlural = 'App Settings'
    displayIcon = settingsPageIcon
    tableIcon = settingsTableIcon
    modelSchema = settingsSchema
    parentTable = null!
    table = TableEnum.SETTINGS
    childTable = null!
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('advancedMode', 'Advanced Mode', 'BOOL'),
        tableColumn('instructionsOverlay', 'Instructions Overlay', 'BOOL'),
        tableColumn('consoleLogs', 'Console Logs', 'BOOL'),
        tableColumn('infoMessages', 'Info Messages', 'BOOL'),
        tableColumn('logRetentionDuration', 'Log Rentention Duration'),
    ]
    supportsColumnFilters = true
    supportsActivityCharts = false
    supportsCharts = false
    supportsInspect = true
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false

    /**
     * Returns QDialogOptions options for the inspect dialog.
     * @example $q.dialog(service.inspectDialogOptions(id))
     */
    inspectDialogOptions(id: IdType): QDialogOptions {
        return {
            component: DialogInspect,
            componentProps: {
                id,
                service: this,
                inspectComponents: [
                    { component: InspectItemString, props: { label: 'Id', recordKey: 'id' } },
                    {
                        component: InspectItemBoolean,
                        props: { label: 'Advanced Mode', recordKey: 'advancedMode' },
                    },
                    {
                        component: InspectItemBoolean,
                        props: { label: 'Instructions Overlay', recordKey: 'instructionsOverlay' },
                    },
                    {
                        component: InspectItemBoolean,
                        props: { label: 'Console Logs', recordKey: 'consoleLogs' },
                    },
                    {
                        component: InspectItemBoolean,
                        props: { label: 'Info Messages', recordKey: 'infoMessages' },
                    },
                    {
                        component: InspectItemString,
                        props: {
                            label: 'Log Rentention Duration',
                            recordKey: 'logRetentionDuration',
                        },
                    },
                ],
            },
        }
    }
}

/**
 * Singleton instance exported for convenience.
 */
export const SettingsServInst = SettingsService.instance()
