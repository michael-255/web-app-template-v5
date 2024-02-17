import { booleanSchema, createdAtSchema, textAreaSchema, uuidSchema } from '@/shared/schemas'
import type { BooleanType, CreatedAtType, TextAreaType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

/**
 * Must include a UUID for the `configId` property or it will fail
 */
export default class ExampleResult {
    id: UUIDType
    createdAt: CreatedAtType
    configId: UUIDType
    notes: TextAreaType
    activated: BooleanType
    skipped: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        configId = '', // Will always fail if it isn't a UUID
        notes = '',
        activated = false,
        skipped = false,
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.configId = uuidSchema.parse(configId)
        this.notes = textAreaSchema.parse(notes)
        this.activated = booleanSchema.parse(activated)
        this.skipped = booleanSchema.parse(skipped)
    }
}
