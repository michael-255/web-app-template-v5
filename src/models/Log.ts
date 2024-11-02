import { TableEnum } from '@/shared/enums'
import type {
    IdType,
    LogDetailsType,
    LogLabelType,
    LogLevelType,
    TimestampType,
} from '@/shared/types'
import { createId } from '@/shared/utils'

interface LogParams {
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType | Error
}

//
// Model
//

/**
 * Application `Log` model.
 *
 * This model is used for all internal logging. Logs can also be reviewed in app.
 */
export class Log {
    id: IdType
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(params: LogParams) {
        this.id = createId(TableEnum.LOGS)
        this.createdAt = Date.now()
        this.logLevel = params.logLevel
        this.label = params.label

        if (params.details instanceof Error) {
            this.details = {
                name: params.details.name,
                message: params.details.message,
                stack: params.details.stack,
            }
        } else {
            this.details = params.details
        }
    }
}
