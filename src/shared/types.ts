import type { ExampleType } from '@/models/Example'
import type { ExampleResultType } from '@/models/ExampleResult'
import type { LogType } from '@/models/Log'
import type { SettingType } from '@/models/Setting'
import { z } from 'zod'
import type {
    idSchema,
    routeNameSchema,
    statusSchema,
    tableSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from './schemas'

//
// App
//

export type TableType = z.infer<typeof tableSchema>

export type RouteNameType = z.infer<typeof routeNameSchema>

//
// Common
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
