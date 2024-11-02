import { z } from 'zod'
import {
    DurationEnum,
    LimitEnum,
    LogLevelEnum,
    RouteNameEnum,
    SettingIdEnum,
    StatusEnum,
    TableEnum,
} from './enums'

/**
 * Defining in one file to reduce the likelyhood of circular dependencies.
 */

//
// Shared
//

export const tableSchema = z.nativeEnum(TableEnum)
export const routeNameSchema = z.nativeEnum(RouteNameEnum)
export const statusSchema = z.nativeEnum(StatusEnum)
export const idSchema = z.string().refine(
    (id) => {
        // Trim off prefix and check if uuid is valid
        // Does not validate if the prefix used is correct
        if (z.string().uuid().safeParse(id.substring(4)).success) {
            return true // uuid valid
        } else if (settingIdSchema.safeParse(id).success) {
            return true // setting id valid
        } else {
            return false // invalid
        }
    },
    {
        message: 'Invalid Id',
    },
)
export const timestampSchema = z.number().int()
export const textLineSchema = z.string().min(1).max(LimitEnum.MAX_TEXT_LINE).trim()
export const textAreaSchema = z.string().max(LimitEnum.MAX_TEXT_AREA).trim() // desc, notes, etc.
export const statusListSchema = z
    .nativeEnum(StatusEnum)
    .array()
    .refine(
        (status) => {
            // Check for duplicates
            // Status not used by a record type will be ignored
            return new Set(status).size === status.length
        },
        {
            message: 'Cannot have duplicate status',
        },
    )

//
// Settings
//

export const settingIdSchema = z.nativeEnum(SettingIdEnum)
export const settingValueSchema = z.union([z.boolean(), z.nativeEnum(DurationEnum)])
export const settingSchema = z.object({
    id: settingIdSchema, // Instead of standard ID
    value: settingValueSchema,
})

//
// Logs
//

export const logLevelSchema = z.nativeEnum(LogLevelEnum)
export const logLabelSchema = z.string().trim()
export const logDetailsSchema = z.record(z.any()).or(z.instanceof(Error)).optional()
export const logSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    logLevel: logLevelSchema,
    label: logLabelSchema,
    details: logDetailsSchema,
})

//
// Example Result
//

export const mockDataSchema = z.number()
export const exampleResultSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    parentId: idSchema,
    note: textAreaSchema,
    mockData: mockDataSchema, // For testing charts on Examples
})

//
// Example
//

export const exampleSchema = z.object({
    id: idSchema,
    createdAt: timestampSchema,
    status: statusListSchema,
    name: textLineSchema,
    desc: textAreaSchema,
    lastChild: exampleResultSchema.optional(),
})
