import { booleanSchema, textAreaSchema, timestampSchema, uuidSchema } from '@/shared/schemas'
import type { BooleanType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'
import type { BaseModel, ChildModel } from './model-interfaces'

/**
 * Must include a UUID for the `exampleId` property or it will fail
 */
export default class ExampleResult implements BaseModel, ChildModel {
    id: UUIDType
    createdAt: TimestampType
    exampleId: UUIDType
    note: TextAreaType
    activated: BooleanType
    skipped: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        exampleId = '', // Will always fail if it isn't a UUID
        note = '',
        activated = false,
        skipped = false,
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.exampleId = uuidSchema.parse(exampleId)
        this.note = textAreaSchema.parse(note)
        this.activated = booleanSchema.parse(activated)
        this.skipped = booleanSchema.parse(skipped)
    }

    /**
     * Displayable label for this model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Result' : 'Example Results'
    }
}
