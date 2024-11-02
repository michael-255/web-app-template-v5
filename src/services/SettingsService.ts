import { settingsSchema } from '@/models/Settings'
import { TableEnum } from '@/shared/enums'
import { settingsPageIcon, settingsTableIcon } from '@/shared/icons'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { BaseService } from './BaseService'

export class SettingsService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Settings'
    labelPlural = 'Settings'
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
    supportsInspect = false
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false
}

/**
 * Singleton instance exported for convenience.
 */
export const SettingsServInst = SettingsService.instance()
