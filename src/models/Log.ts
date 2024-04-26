import { TableEnum } from '@/shared/enums'
import {
    type IdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

/**
 * Application `Log` model.
 *
 * This model is used for all internal app logging. Logs can also be reviewed in app.
 */
export default class Log {
    id: IdType
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor({
        id,
        createdAt,
        logLevel,
        label,
        details,
    }: {
        id?: IdType
        createdAt?: TimestampType
        logLevel: LogLevelType
        label: LogLabelType
        details: LogDetailsType
    }) {
        this.id = id ?? createId(TableEnum.LOGS)
        this.createdAt = createdAt ?? Date.now()
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
