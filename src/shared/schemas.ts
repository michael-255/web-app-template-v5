import { Enum } from '@/shared'
import { z } from 'zod'

// Enums
export const limit = z.nativeEnum(Enum.Limit)
export const dbTable = z.nativeEnum(Enum.DBTable)
export const settingKey = z.nativeEnum(Enum.SettingKey)
export const logLevel = z.nativeEnum(Enum.LogLevel)
export const tag = z.nativeEnum(Enum.Tag)
export const duration = z.nativeEnum(Enum.Duration)
export const routeName = z.nativeEnum(Enum.RouteName)

// Setting
export const settingValue = z.boolean().or(z.string()).or(z.number()).optional()

// Log
export const logAutoId = z.number().int().optional()
export const logDetails = z.unknown()
export const logLabel = z.string().trim()
export const logErrorMessage = z.string().trim().optional()
export const logStackTrace = z.string().trim().optional()

// Shared
export const uuid = z.string().uuid()
export const createdAt = z.number().int()
export const name = z.string().min(Enum.Limit.MIN_NAME).max(Enum.Limit.MAX_NAME).trim()
export const desc = z.string().max(Enum.Limit.MAX_TEXT_AREA).trim()
export const tags = z
    .nativeEnum(Enum.Tag)
    .array()
    .refine(
        (tags) => {
            const uniqueTags = new Set(tags)
            return uniqueTags.size === tags.length
        },
        {
            message: 'Cannot have duplicate tags',
        },
    )

// Example
export const data = z.array(z.number())
