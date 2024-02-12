import { logErrorMessageSchema, logLabelSchema, logStackTraceSchema } from '@/shared/schemas'
import {
    type CreatedAtType,
    type LogAutoIdType,
    type LogDetailsType,
    type LogErrorMessageType,
    type LogLabelType,
    type LogLevelType,
    type LogStackTraceType,
} from '@/shared/types'

export default class Log {
    autoId: LogAutoIdType // Auto incremented by Dexie
    createdAt: CreatedAtType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType
    errorMessage: LogErrorMessageType
    stackTrace: LogStackTraceType

    // Only need Zod schemas for a few properties to provide further validation beyond the Type
    constructor(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = logLabelSchema.parse(label)

        if (details && typeof details === 'object') {
            if ('message' in details && 'stack' in details) {
                // An object with a message and stack property is a JS Error
                this.errorMessage = details?.message
                    ? logErrorMessageSchema.parse(details.message)
                    : undefined
                this.stackTrace = details?.stack
                    ? logStackTraceSchema.parse(details.stack)
                    : undefined
            } else {
                this.details = details
            }
        }
    }
}
