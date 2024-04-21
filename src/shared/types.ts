import type Example from '@/models/Example'
import type ExampleResult from '@/models/ExampleResult'
import type Log from '@/models/Log'
import type Setting from '@/models/Setting'
import type { TableEnum } from '@/shared/enums'
import type {
    dbRecordSchema,
    idSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    nameSchema,
    optionalTimestampSchema,
    settingValueSchema,
    textAreaSchema,
    timestampSchema,
} from '@/shared/schemas'
import { z } from 'zod'

// Setting
export type SettingValueType = z.infer<typeof settingValueSchema>

// Log
export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>

// Shared
export type DBRecordType = z.infer<typeof dbRecordSchema>
export type IdType = z.infer<typeof idSchema>
export type TimestampType = z.infer<typeof timestampSchema>
export type OptionalTimestampType = z.infer<typeof optionalTimestampSchema>
export type NameType = z.infer<typeof nameSchema>
export type TextAreaType = z.infer<typeof textAreaSchema>

// Database
export type BackupDataType = {
    appName: string
    databaseVersion: string
    createdAt: number
    [TableEnum.SETTINGS]: Setting[]
    [TableEnum.LOGS]: Log[]
    [TableEnum.EXAMPLES]: Example[]
    [TableEnum.EXAMPLE_RESULTS]: ExampleResult[]
}
