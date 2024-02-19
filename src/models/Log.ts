import { logDetailsSchema, logLabelSchema, logLevelSchema } from '@/shared/schemas'
import {
    type LogAutoIdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'

export default class Log {
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
            this.details = logDetailsSchema.parse({
                name: details.name,
                message: details.message,
                stack: details.stack,
            })
        } else {
            this.details = logDetailsSchema.parse(details)
        }
    }

    /**
     * Displayable label for this model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }
}
