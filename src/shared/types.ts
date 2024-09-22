import type {
    exampleResultSchema,
    exampleSchema,
    idSchema,
    logAutoIdSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    logSchema,
    mockDataSchema,
    optionalTimestampSchema,
    routeNameSchema,
    settingKeySchema,
    settingSchema,
    settingValueSchema,
    tableSchema,
    tagSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '@/shared/schemas'
import { z } from 'zod'

//
// App
//
export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

//
// Setting
//
export type SettingType = z.infer<typeof settingSchema>

export type SettingKeyType = z.infer<typeof settingKeySchema>

export type SettingValueType = z.infer<typeof settingValueSchema>

//
// Log
//
export type LogType = z.infer<typeof logSchema>

export type LogAutoIdType = z.infer<typeof logAutoIdSchema>

export type LogLevelType = z.infer<typeof logLevelSchema>

export type LogLabelType = z.infer<typeof logLabelSchema>

export type LogDetailsType = z.infer<typeof logDetailsSchema>

//
// Example Result
//
export type MockDataType = z.infer<typeof mockDataSchema>

//
// Shared
//
export type IdType = z.infer<typeof idSchema>

export type TimestampType = z.infer<typeof timestampSchema>

export type OptionalTimestampType = z.infer<typeof optionalTimestampSchema>

export type TextLineType = z.infer<typeof textLineSchema>

export type TextAreaType = z.infer<typeof textAreaSchema>

export type TagType = z.infer<typeof tagSchema>

//
// Models
//
export type ExampleType = z.infer<typeof exampleSchema>

export type ExampleResultType = z.infer<typeof exampleResultSchema>

//
// Database
//
export type BackupType = {
    appName: string
    databaseVersion: string
    createdAt: number
    settings: SettingType[]
    logs: LogType[]
    examples: ExampleType[]
    exampleResults: ExampleResultType[]
}

//
// Frontend
//
export type SelectOption = {
    value: IdType
    label: string
    disable: boolean
}
