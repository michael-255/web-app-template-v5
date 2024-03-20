import {
    ChildTagEnum,
    DBTableEnum,
    DurationEnum,
    LimitEnum,
    LogLevelEnum,
    ParentTagEnum,
    RouteNameEnum,
    SettingKeyEnum,
} from '@/shared/enums'
import { z } from 'zod'

// Enums
export const limitSchema = z.nativeEnum(LimitEnum)
export const dbTableSchema = z.nativeEnum(DBTableEnum)
export const parentTagSchema = z.nativeEnum(ParentTagEnum)
export const childTagSchema = z.nativeEnum(ChildTagEnum)
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
export const timestampSchema = z.number().int()
export const optionalTimestampSchema = z.number().int().optional()
export const nameSchema = z.string().min(LimitEnum.MIN_NAME).max(LimitEnum.MAX_NAME).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.
export const booleanSchema = z.boolean()
export const parentTagsSchema = z
    .nativeEnum(ParentTagEnum)
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
export const childTagsSchema = z
    .nativeEnum(ChildTagEnum)
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

// Models
export const settingSchema = z.object({
    key: settingKeySchema,
    value: settingValueSchema,
})
export const logSchema = z.object({
    autoId: logAutoIdSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})
export const exampleSchema = z.object({
    id: uuidSchema,
    createdAt: timestampSchema,
    name: nameSchema,
    desc: textAreaSchema,
    tags: parentTagsSchema,
    locked: booleanSchema, // TODO: Remove this
    favorited: booleanSchema, // TODO: Remove this
    enabled: booleanSchema, // TODO: Remove this
    lastChildCreatedAt: optionalTimestampSchema,
    lastChildNote: textAreaSchema,
})
export const exampleResultSchema = z.object({
    id: uuidSchema,
    createdAt: timestampSchema,
    parentId: uuidSchema,
    note: textAreaSchema,
    tags: childTagsSchema,
    locked: booleanSchema, // TODO: Remove this
    skipped: booleanSchema, // TODO: Remove this
})
