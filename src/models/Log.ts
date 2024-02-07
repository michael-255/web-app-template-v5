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
            if ('message' in details && 'stack' in details) {
                // An object with a message and stack property is a JS Error
                this.errorMessage = details?.message
                    ? Schema.logErrorMessage.parse(details.message)
                    : undefined
                this.stackTrace = details?.stack
                    ? Schema.logStackTrace.parse(details.stack)
                    : undefined
            } else {
                this.details = details
            }
        }
    }

    /**
     * Displayable label for this model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }

    /**
     * What model information is visible in the data table and in what order
     */
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

    /**
     * Only table columns that are required will not be togglable in the UI (hidden columns)
     */
    static getColumnOptions() {
        return this.getTableColumns().filter((col) => !col.required)
    }

    /**
     * What column options are visiable on the data table (based on getColumnOptions)
     */
    static getVisibleColumns() {
        return this.getColumnOptions().map((col) => col.name)
    }
}
