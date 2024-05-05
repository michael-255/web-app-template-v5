import type { TableEnum } from '@/shared/enums'
import type {
    dbModelSchema,
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
import type { Component } from 'vue'
import { z } from 'zod'

// Setting
export type SettingValueType = z.infer<typeof settingValueSchema>

// Log
export type LogLevelType = z.infer<typeof logLevelSchema>
export type LogLabelType = z.infer<typeof logLabelSchema>
export type LogDetailsType = z.infer<typeof logDetailsSchema>

// Shared
export type ModelType = z.infer<typeof dbModelSchema>
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
} & {
    [key in TableEnum]: ModelType[]
}

// Frontend
export type SelectOption = {
    value: IdType
    label: string
    disable: boolean
}

export type ModelComponent = {
    component: Component
    props?: Record<string, any>
}
