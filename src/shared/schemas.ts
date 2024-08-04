import {
    GroupEnum,
    LimitEnum,
    LogLevelEnum,
    RouteTableEnum,
    SettingKeyEnum,
    TableEnum,
    TagEnum,
} from '@/shared/enums'
import { z } from 'zod'

// Enums
export const routeTableSchema = z.nativeEnum(RouteTableEnum)
export const tableSchema = z.nativeEnum(TableEnum)
export const groupSchema = z.nativeEnum(GroupEnum)

// Setting
export const settingKeySchema = z.nativeEnum(SettingKeyEnum)
export const settingValueSchema = z
    .union([z.boolean(), z.number(), z.string(), z.null()])
    .optional()

// Log
export const logAutoIdSchema = z.number().int().optional()
export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()

// Shared
export const idSchema = z.string().refine(
    (id) => {
        const tablePrefix = id.substring(0, 3)
        if (tableSchema.safeParse(tablePrefix).success) {
            if (z.string().uuid().safeParse(id.substring(4)).success) {
                return true // uuid valid
            } else {
                return false // uuid invalid
            }
        } else {
            return false // table prefix invalid
        }
    },
    {
        message: 'Invalid Id',
    },
)
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
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagsSchema,
    parentId: idSchema,
    note: textAreaSchema,
})
export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    tags: tagsSchema,
    name: nameSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
