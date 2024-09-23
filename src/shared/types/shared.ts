import { z } from 'zod'
import type {
    idSchema,
    routeNameSchema,
    statusSchema,
    tableSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from '../schemas/shared'
import type { ExampleType } from './example'
import type { ExampleResultType } from './example-result'
import type { LogType } from './log'
import type { SettingType } from './setting'

//
// App
//
export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

//
// Shared
//
export type IdType = z.infer<typeof idSchema>

export type TimestampType = z.infer<typeof timestampSchema>

export type TextLineType = z.infer<typeof textLineSchema>

export type TextAreaType = z.infer<typeof textAreaSchema>

export type StatusType = z.infer<typeof statusSchema>

//
// Database
//
export type BackupType = {
    appName: string
    databaseVersion: string
    createdAt: TimestampType
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
