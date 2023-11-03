import type { LogLevel } from '@/shared/enums'
import type { QTableColumn } from 'quasar'

export class Log {
    autoId?: number // Auto incremented by Dexie
    createdAt!: number
    logLevel!: LogLevel
    label!: string
    extraDetails?: Record<string, any>
    errorMessage?: string
    stackTrace?: string

    constructor(logLevel: LogLevel, label: string, extraDetails: Record<string, any>) {
        this.createdAt = Date.now()
        this.logLevel = logLevel
        this.label = label

        if (extraDetails && typeof extraDetails === 'object') {
            if ('message' in extraDetails || 'stack' in extraDetails) {
                // An object with a message or stack property is a JS Error
                this.errorMessage = extraDetails.message
                this.stackTrace = extraDetails.stack
                this.extraDetails = undefined
            } else {
                // Should be safe to store most other objects into the details property
                // Details only used with non-error logs
                this.extraDetails = extraDetails
            }
        }
    }

    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Log' : 'Logs'
    }

    static getInspectionItems(): any[] {
        return []
    }

    static getTableColumns(): QTableColumn[] {
        return []
    }
}
