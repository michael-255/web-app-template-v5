import { z } from 'zod'
import type {
    createdAt,
    data,
    desc,
    logAutoId,
    logDetails,
    logErrorMessage,
    logLabel,
    logLevel,
    logStackTrace,
    name,
    settingKey,
    settingValue,
    tags,
    uuid,
} from './schemas'

// Setting
export type SettingKey = z.infer<typeof settingKey>
export type SettingValue = z.infer<typeof settingValue>

// Log
export type LogAutoId = z.infer<typeof logAutoId>
export type LogLevel = z.infer<typeof logLevel>
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
