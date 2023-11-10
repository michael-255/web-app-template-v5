import { Schema, Type } from '@/shared'
import type { QTableColumn } from 'quasar'

export class Log {
    autoId: Type.LogAutoId // Auto incremented by Dexie
    createdAt: Type.CreatedAt
    logLevel: Type.LogLevel
    label: Type.LogLabel
    extraDetails: Type.LogExtraDetails
    errorMessage: Type.LogErrorMessage
    stackTrace: Type.LogStackTrace

    // Only need Zod schemas for a few properties to provide further validation beyond the Type
    constructor(logLevel: Type.LogLevel, label: Type.LogLabel, extraDetails?: Type.LogExtraDetails) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = Schema.logLabel.parse(label)

        if (extraDetails && typeof extraDetails === 'object') {
            // An object with a message or stack property is a JS Error
            this.errorMessage = extraDetails?.message ? Schema.logErrorMessage.parse(extraDetails.message) : undefined
            this.stackTrace = extraDetails?.stack ? Schema.logStackTrace.parse(extraDetails.stack) : undefined
            // If it's an error, extraDetails is undefined, otherwise it's the original value
            this.extraDetails =
                'message' in extraDetails || 'stack' in extraDetails
                    ? undefined
                    : Schema.logExtraDetails.parse(extraDetails)
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
