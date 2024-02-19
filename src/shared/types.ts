import type Example from '@/models/Example'
import type ExampleResult from '@/models/ExampleResult'
import type Log from '@/models/Log'
import type Setting from '@/models/Setting'
import type { DBTableEnum } from '@/shared/enums'
import { z } from 'zod'
import type {
    booleanSchema,
    dbTableSchema,
    durationSchema,
    limitSchema,
    logAutoIdSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    nameSchema,
    optionalTimestampSchema,
    routeNameSchema,
    settingKeySchema,
    settingValueSchema,
    tagSchema,
    tagsSchema,
    textAreaSchema,
    timestampSchema,
    uuidSchema,
} from './schemas'

// Enums
export type DBTableType = z.infer<typeof dbTableSchema>
export type RouteNameType = z.infer<typeof routeNameSchema>
export type DurationType = z.infer<typeof durationSchema>
export type LimitType = z.infer<typeof limitSchema>
export type TagType = z.infer<typeof tagSchema>

// Setting
export type SettingKeyType = z.infer<typeof settingKeySchema>
export type SettingValueType = z.infer<typeof settingValueSchema>

// Log
export type LogAutoIdType = z.infer<typeof logAutoIdSchema>
export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>

// Shared
export type UUIDType = z.infer<typeof uuidSchema>
export type TimestampType = z.infer<typeof timestampSchema>
export type OptionalTimestampType = z.infer<typeof optionalTimestampSchema>
export type NameType = z.infer<typeof nameSchema>
export type TextAreaType = z.infer<typeof textAreaSchema>
export type BooleanType = z.infer<typeof booleanSchema>
export type TagsType = z.infer<typeof tagsSchema>

// Database
export type BackupDataType = {
    appName: string
    databaseVersion: string
    createdAt: number
    [DBTableEnum.SETTINGS]: Setting[]
    [DBTableEnum.LOGS]: Log[]
    [DBTableEnum.EXAMPLES]: Example[]
    [DBTableEnum.EXAMPLE_RESULTS]: ExampleResult[]
}
