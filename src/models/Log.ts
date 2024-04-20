import {
    type IdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'
import { uid } from 'quasar'

export default class Log {
    id: IdType
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        this.id = uid()
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = label

        if (details instanceof Error) {
            this.details = {
                name: details.name,
                message: details.message,
                stack: details.stack,
            }
        } else {
            this.details = details
        }
    }
}
