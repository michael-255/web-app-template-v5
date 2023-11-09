import { Schema } from '@/shared'
import type { QTableColumn } from 'quasar'

export class Log {
    autoId: Schema.LogAutoId // Auto incremented by Dexie
    createdAt: Schema.CreatedAt
    logLevel: Schema.LogLevel
    label: Schema.LogLabel
    extraDetails: Schema.LogExtraDetails
    errorMessage: Schema.LogErrorMessage
    stackTrace: Schema.LogStackTrace

    constructor(logLevel: Schema.LogLevel, label: Schema.LogLabel, extraDetails?: Schema.LogExtraDetails) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = label

        if (extraDetails && typeof extraDetails === 'object') {
            // An object with a message or stack property is a JS Error
            this.errorMessage = extraDetails.message ?? this.errorMessage
            this.stackTrace = extraDetails.stack ?? this.stackTrace
            // If it's an error, extraDetails is undefined, otherwise it's the original value
            this.extraDetails = 'message' in extraDetails || 'stack' in extraDetails ? undefined : extraDetails
        }
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }

    static getInspectionItems(): any[] {
        return []
    }

    static getTableColumns(): QTableColumn[] {
        return []
    }
}
