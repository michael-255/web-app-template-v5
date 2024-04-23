import Base from '@/models/_Base'
import { createId } from '@/shared/db-utils'
import { TableEnum } from '@/shared/enums'
import { type LogDetailsType, type LogLabelType, type LogLevelType } from '@/shared/types'

export default class Log extends Base {
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType

    constructor(logLevel: LogLevelType, label: LogLabelType, details?: LogDetailsType) {
        super({ id: createId(TableEnum.LOGS), createdAt: Date.now() })
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
