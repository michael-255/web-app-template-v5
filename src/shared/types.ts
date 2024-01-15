import type { ExampleConfig, ExampleResult, Log, Setting } from '@/models'
import { Enum } from '@/shared'
import { z } from 'zod'
import type {
    createdAt,
    data,
    dbTable,
    desc,
    duration,
    limit,
    logAutoId,
    logDetails,
    logErrorMessage,
    logLabel,
    logLevel,
    logStackTrace,
    name,
    routeName,
    settingKey,
    settingValue,
    tag,
    tags,
    uuid,
} from './schemas'

// Enums
export type Limit = z.infer<typeof limit>
export type DBTable = z.infer<typeof dbTable>
export type SettingKey = z.infer<typeof settingKey>
export type LogLevel = z.infer<typeof logLevel>
export type Tag = z.infer<typeof tag>
export type Duration = z.infer<typeof duration>
export type RouteName = z.infer<typeof routeName>

// Setting
export type SettingValue = z.infer<typeof settingValue>

// Log
export type LogAutoId = z.infer<typeof logAutoId>
export type LogDetails = z.infer<typeof logDetails>
export type LogLabel = z.infer<typeof logLabel>
export type LogErrorMessage = z.infer<typeof logErrorMessage>
export type LogStackTrace = z.infer<typeof logStackTrace>

// Shared
export type UUID = z.infer<typeof uuid>
export type CreatedAt = z.infer<typeof createdAt>
export type Name = z.infer<typeof name>
export type Desc = z.infer<typeof desc>
export type Tags = z.infer<typeof tags>

// Example
export type Data = z.infer<typeof data>

// Database
export type BackupData = {
    appName: string
    databaseVersion: string
    createdAt: number
    [Enum.DBTable.SETTINGS]: Setting[]
    [Enum.DBTable.LOGS]: Log[]
    [Enum.DBTable.EXAMPLE_CONFIGS]: ExampleConfig[]
    [Enum.DBTable.EXAMPLE_RESULTS]: ExampleResult[]
}
