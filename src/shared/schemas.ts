import { Enum } from '@/shared'
import { z } from 'zod'

// Setting
export const settingKey = z.nativeEnum(Enum.SettingKey)
export type SettingKey = z.infer<typeof settingKey>

export const settingValue = z.boolean().or(z.string()).or(z.number()).optional()
export type SettingValue = z.infer<typeof settingValue>

// Log
export const logAutoId = z.number().int().optional()
export type LogAutoId = z.infer<typeof logAutoId>

export const logLevel = z.nativeEnum(Enum.LogLevel)
export type LogLevel = z.infer<typeof logLevel>

export const logExtraDetails = z.record(z.any()).optional()
export type LogExtraDetails = z.infer<typeof logExtraDetails>

export const logLabel = z.string().trim()
export type LogLabel = z.infer<typeof logLabel>

export const logErrorMessage = z.string().trim().optional()
export type LogErrorMessage = z.infer<typeof logErrorMessage>

export const logStackTrace = z.string().trim().optional()
export type LogStackTrace = z.infer<typeof logStackTrace>

// Shared
export const uuid = z.string().uuid()
export type UUID = z.infer<typeof uuid>

export const createdAt = z.number().int()
export type CreatedAt = z.infer<typeof createdAt>

export const name = z.string().min(Enum.Limit.MIN_NAME).max(Enum.Limit.MAX_NAME).trim()
export type Name = z.infer<typeof name>

export const desc = z.string().max(Enum.Limit.MAX_TEXT_AREA).trim()
export type Desc = z.infer<typeof desc>

export const tags = z
    .nativeEnum(Enum.Tag)
    .array()
    .refine(
        (tags) => {
            const uniqueTags = new Set(tags)
            return uniqueTags.size === tags.length
        },
        {
            message: 'Array must not contain duplicate tags',
        },
    )
export type Tags = z.infer<typeof tags>

// Example
export const data = z.array(z.number())
export type Data = z.infer<typeof data>
