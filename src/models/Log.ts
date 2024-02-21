import type { ModelMethods } from '@/models/model-interfaces'
import { logDetailsSchema, logLabelSchema, logLevelSchema, logSchema } from '@/shared/schemas'
import {
    type LogAutoIdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import type { QTableColumn } from 'quasar'

export default class Log implements ModelMethods {
    autoId: LogAutoIdType // Auto incremented by Dexie
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        this.createdAt = Date.now() // Explicitly set, so don't need to schema validate
        this.logLevel = logLevelSchema.parse(logLevel)
        this.label = logLabelSchema.parse(label)

        if (details instanceof Error) {
            this.details = {
                name: details.name,
                message: details.message,
                stack: details.stack,
            }
        } else {
            this.details = details
        }
        this.details = logDetailsSchema.parse(this.details)
    }

    /**
     * Validate the model using it's Zod schema
     */
    isValid(): boolean {
        return logSchema.safeParse(this).success
    }

    /**
     * Displayable labels for the model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }

    /**
     * @TODO
     */
    static getTableColumns(): QTableColumn[] {
        return [
            hiddenTableColumn('autoId'),
            tableColumn('autoId', 'Auto Id'),
            tableColumn('createdAt', 'Created Date', 'DATE'),
            tableColumn('logLevel', 'Log Level'),
            tableColumn('label', 'Label', 'TEXT'),
            tableColumn('details', 'Details', 'JSON'),
        ]
    }

    /**
     * @TODO
     */
    static getInspectionFormat() {
        return [
            {
                property: 'id',
                label: 'Id',
            },
        ]
    }
}
