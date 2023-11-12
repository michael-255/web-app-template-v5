import { Schema, TableColumn, Type } from '@/shared'

export class Log {
    autoId: Type.LogAutoId // Auto incremented by Dexie
    createdAt: Type.CreatedAt
    logLevel: Type.LogLevel
    label: Type.LogLabel
    details: Type.LogDetails
    errorMessage: Type.LogErrorMessage
    stackTrace: Type.LogStackTrace

    // Only need Zod schemas for a few properties to provide further validation beyond the Type
    constructor(logLevel: Type.LogLevel, label: Type.LogLabel, details?: Type.LogDetails) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = Schema.logLabel.parse(label)

        if (details && typeof details === 'object') {
            // An object with a message or stack property is a JS Error
            this.errorMessage = details?.message ? Schema.logErrorMessage.parse(details.message) : undefined
            this.stackTrace = details?.stack ? Schema.logStackTrace.parse(details.stack) : undefined
            // If it's an error, details is undefined, otherwise it's the original value
            this.details = 'message' in details || 'stack' in details ? undefined : Schema.logDetails.parse(details)
        }
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }

    static getInspectionItems(): any[] {
        return []
    }

    static getTableColumns() {
        return [
            TableColumn.hiddenAutoIdColumn,
            TableColumn.autoIdColumn,
            TableColumn.createdAtColumn,
            TableColumn.logLevelColumn,
            TableColumn.labelColumn,
            TableColumn.detailsColumn,
            TableColumn.errorMessageColumn,
            TableColumn.stackTraceColumn,
        ]
    }
}
