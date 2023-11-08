import { Enum } from '@/shared'
import { z } from 'zod'

export const data = z.array(z.number())
export type Data = z.infer<typeof data>

export const extraDetails = z.record(z.any()).optional()
export type ExtraDetails = z.infer<typeof extraDetails>

export const name = z.string().min(Enum.Limit.MIN_NAME).max(Enum.Limit.MAX_NAME).trim()
export type Name = z.infer<typeof name>

export const optionalNumber = z.number().int().optional()
export type OptionalNumber = z.infer<typeof optionalNumber>

export const optionalTimestamp = z.number().int().optional()
export type OptionalTimestamp = z.infer<typeof optionalTimestamp>

export const requiredTimestamp = z.number().int()
export type RequiredTimestamp = z.infer<typeof requiredTimestamp>

export const settingValue = z.boolean().or(z.string()).or(z.number()).optional()
export type SettingValue = z.infer<typeof settingValue>

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

export const textArea = z.string().max(Enum.Limit.MAX_TEXT_AREA).trim()
export type TextArea = z.infer<typeof textArea>

export const trimString = z.string().trim()
export type TrimString = z.infer<typeof trimString>

export const uuid = z.string().uuid()
export type UUID = z.infer<typeof uuid>
