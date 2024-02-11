import { Schema, Type } from '@/shared'

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
}
