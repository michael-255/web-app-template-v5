import { createdAtSchema, textAreaSchema, uuidSchema } from '@/shared/schemas'
import type { CreatedAtType, TextAreaType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult {
    id: UUIDType
    createdAt: CreatedAtType
    configId: UUIDType
    notes: TextAreaType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        configId = '',
        notes = '',
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.configId = uuidSchema.parse(configId)
        this.notes = textAreaSchema.parse(notes)
    }
}
