import { DBTableEnum, LimitEnum, LogLevelEnum, SettingIdEnum, TagEnum } from '@/shared/enums'
import { z } from 'zod'

// Enums
export const dbTableSchema = z.nativeEnum(DBTableEnum)

// Setting
export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

// Log
export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

// Shared
export const idSchema = z.nativeEnum(SettingIdEnum).or(z.string().uuid())
export const timestampSchema = z.number().int()
export const optionalTimestampSchema = z.number().int().optional()
export const nameSchema = z.string().min(LimitEnum.MIN_NAME).max(LimitEnum.MAX_NAME).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // For desc, notes, etc.
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

// Models
export const settingSchema = z.object({
    id: idSchema,
    value: settingValueSchema,
})
export const logSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    parentId: idSchema,
    note: textAreaSchema,
    tags: tagsSchema,
})
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    name: nameSchema,
    desc: textAreaSchema,
    tags: tagsSchema,
    lastChild: exampleResultSchema.optional(),
})

// Database
export const dbRecordSchema = z
    .object({
        ...settingSchema.partial().shape,
        ...logSchema.partial().shape,
        ...exampleSchema.partial().shape,
        ...exampleResultSchema.partial().shape,
    })
    .or(z.record(z.any()))
