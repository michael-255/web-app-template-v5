import { appSettingsId } from '@/shared/constants'
import { DurationEnum } from '@/shared/enums'
import { idSchema } from '@/shared/schemas'
import type { IdType } from '@/shared/types'
import { z } from 'zod'

//
// Schemas
//

export const settingsSchema = z.object({
    id: idSchema,
    advancedMode: z.boolean(),
    instructionsOverlay: z.boolean(),
    consoleLogs: z.boolean(),
    infoMessages: z.boolean(),
    logRetentionDuration: z.nativeEnum(DurationEnum),
})

//
// Types
//

export type SettingsType = z.infer<typeof settingsSchema>

interface SettingsParams {
    id?: IdType
    context?: string
    advancedMode?: boolean
    instructionsOverlay?: boolean
    consoleLogs?: boolean
    infoMessages?: boolean
    logRetentionDuration?: DurationEnum
}

//
// Model
//

/**
 * Application `Settings` model.
 *
 * This model is used for app wide settings. They are initialized and live queried during startup
 * in `App.vue` and stored in the `SettingsStore` for easy access.
 */
export class Settings {
    id: IdType
    advancedMode: boolean
    instructionsOverlay: boolean
    consoleLogs: boolean
    infoMessages: boolean
    logRetentionDuration: DurationEnum

    constructor(params: SettingsParams) {
        this.id = params.id ?? appSettingsId
        this.advancedMode = params.advancedMode ?? false
        this.instructionsOverlay = params.instructionsOverlay ?? true
        this.consoleLogs = params.consoleLogs ?? false
        this.infoMessages = params.infoMessages ?? true
        this.logRetentionDuration = params.logRetentionDuration ?? DurationEnum['Six Months']
    }
}
