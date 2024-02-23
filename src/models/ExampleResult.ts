import type { ChildModel } from '@/models/model-interfaces'
import { booleanSchema, textAreaSchema, timestampSchema, uuidSchema } from '@/shared/schemas'
import type { BooleanType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

/**
 * Must include a UUID for the `parentId` property or it will fail
 * - `parentId` = Parent Example Id
 */
export default class ExampleResult implements ChildModel {
    id: UUIDType
    createdAt: TimestampType
    parentId: UUIDType
    note: TextAreaType
    locked: BooleanType
    skipped: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        parentId = '', // Fails without UUID
        note = '',
        locked = false,
        skipped = false,
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.parentId = uuidSchema.parse(parentId)
        this.note = textAreaSchema.parse(note)
        this.locked = booleanSchema.parse(locked)
        this.skipped = booleanSchema.parse(skipped)
    }
}
