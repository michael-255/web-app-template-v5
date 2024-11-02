import DialogChartActivityLogs from '@/components/dialogs/chart/DialogChartActivityLogs.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import InspectItemDate from '@/components/dialogs/inspect/InspectItemDate.vue'
import InspectItemObject from '@/components/dialogs/inspect/InspectItemObject.vue'
import InspectItemString from '@/components/dialogs/inspect/InspectItemString.vue'
import { logSchema } from '@/models/Log'
import { TableEnum } from '@/shared/enums'
import { logsTableIcon } from '@/shared/icons'
import type { IdType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import type { QDialogOptions } from 'quasar'
import { BaseService } from './BaseService'

export class LogService extends BaseService {
    public constructor() {
        super()
    }

    labelSingular = 'Log'
    labelPlural = 'Logs'
    displayIcon = logsTableIcon
    tableIcon = logsTableIcon
    modelSchema = logSchema
    parentTable = null!
    table = TableEnum.LOGS
    childTable = null!
    tableColumns = [
        hiddenTableColumn('id'),
        tableColumn('id', 'Id', 'UUID'),
        tableColumn('createdAt', 'Created Date', 'DATE'),
        tableColumn('logLevel', 'Log Level'),
        tableColumn('label', 'Label', 'TEXT'),
        tableColumn('details', 'Details', 'JSON'),
    ]
    supportsColumnFilters = true
    supportsActivityCharts = true
    supportsCharts = false
    supportsInspect = true
    supportsCreate = false
    supportsEdit = false
    supportsDelete = false

    /**
     * Returns QDialogOptions options for the chart dialog.
     * @example $q.dialog(service.activityChartsDialogOptions(id))
     */
    activityChartsDialogOptions(): QDialogOptions {
        return { component: DialogChartActivityLogs }
    }

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
                        component: InspectItemDate,
                        props: { label: 'Created Date', recordKey: 'createdAt' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Log Level', recordKey: 'logLevel' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Description', recordKey: 'desc' },
                    },
                    {
                        component: InspectItemString,
                        props: { label: 'Label', recordKey: 'label' },
                    },
                    {
                        component: InspectItemObject,
                        props: { label: 'Details', recordKey: 'details' },
                    },
                ],
            },
        }
    }
}

/**
 * Singleton instance exported for convenience.
 */
export const LogServInst = LogService.instance()
