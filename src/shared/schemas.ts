import {
    DBTableEnum,
    DurationEnum,
    LimitEnum,
    LogLevelEnum,
    RouteNameEnum,
    SettingKeyEnum,
    TagEnum,
} from '@/shared/enums'
import { z } from 'zod'

// Enums
export const limitSchema = z.nativeEnum(LimitEnum)
export const dbTableSchema = z.nativeEnum(DBTableEnum)
export const tagSchema = z.nativeEnum(TagEnum)
export const durationSchema = z.nativeEnum(DurationEnum)
export const routeNameSchema = z.nativeEnum(RouteNameEnum)

// Setting
export const settingKeySchema = z.nativeEnum(SettingKeyEnum)
export const settingValueSchema = z.boolean().or(z.string()).or(z.number()).optional()

// Log
export const logAutoIdSchema = z.number().int().optional()
export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

// Shared
export const uuidSchema = z.string().uuid()
export const createdAtSchema = z.number().int()
export const nameSchema = z.string().min(LimitEnum.MIN_NAME).max(LimitEnum.MAX_NAME).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.
export const booleanSchema = z.boolean()
export const tagsSchema = z
    .nativeEnum(TagEnum)
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
