import { createdAtSchema, notesSchema, uuidSchema } from '@/shared/schemas'
import type { CreatedAtType, NotesType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult {
    id: UUIDType
    createdAt: CreatedAtType
    configId: UUIDType
    notes: NotesType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        configId = '',
        notes = '',
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.configId = uuidSchema.parse(configId)
        this.notes = notesSchema.parse(notes)
    }
}
