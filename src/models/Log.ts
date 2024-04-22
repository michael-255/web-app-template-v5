import type { BaseModel } from '@/models/model-interfaces'
import { createId } from '@/shared/db-utils'
import { TableEnum } from '@/shared/enums'
import {
    type IdType,
    type LogDetailsType,
    type LogLabelType,
    type LogLevelType,
    type TimestampType,
} from '@/shared/types'

export default class Log implements BaseModel {
    id: IdType
    createdAt: TimestampType
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        this.id = createId(TableEnum.LOGS)
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
