import type { BaseService } from '@/services/BaseService'
import type { Component } from 'vue'
import { z } from 'zod'
import type {
    exampleResultSchema,
    exampleSchema,
    idSchema,
    logDetailsSchema,
    logLabelSchema,
    logLevelSchema,
    logSchema,
    mockDataSchema,
    routeNameSchema,
    settingIdSchema,
    settingSchema,
    settingValueSchema,
    statusSchema,
    tableSchema,
    textAreaSchema,
    textLineSchema,
    timestampSchema,
} from './schemas'

//
// App
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

export type SelectOption = {
    value: IdType
    label: string
    disable: boolean
}

export type ComponentWithPropsType = {
    component: Component
    props?: Record<string, any>
}

//
// Shared
//

export type TableType = z.infer<typeof tableSchema>
export type RouteNameType = z.infer<typeof routeNameSchema>
export type ServiceType = InstanceType<new (...args: any[]) => BaseService>
export type IdType = z.infer<typeof idSchema>
export type TimestampType = z.infer<typeof timestampSchema>
export type TextLineType = z.infer<typeof textLineSchema>
export type TextAreaType = z.infer<typeof textAreaSchema>
export type StatusType = z.infer<typeof statusSchema>

//
// Settings
//

export type SettingIdType = z.infer<typeof settingIdSchema>
export type SettingValueType = z.infer<typeof settingValueSchema>
export type SettingType = z.infer<typeof settingSchema>

//
// Logs
//

export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>
export type LogType = z.infer<typeof logSchema>

//
// Example Result
//

export type MockDataType = z.infer<typeof mockDataSchema>
export type ExampleResultType = z.infer<typeof exampleResultSchema>

//
// Example
//

export type ExampleType = z.infer<typeof exampleSchema>
