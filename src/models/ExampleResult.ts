import { booleanSchema, createdAtSchema, textAreaSchema, uuidSchema } from '@/shared/schemas'
import type { BooleanType, CreatedAtType, TextAreaType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

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
        configId = '',
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
