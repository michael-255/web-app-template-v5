import { createdAtSchema, uuidSchema } from '@/shared/schemas'
import type { CreatedAtType, UUIDType } from '@/shared/types'
import { uid } from 'quasar'

export default class ExampleResult {
    id: UUIDType
    createdAt: CreatedAtType
    configId: UUIDType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        configId = '',
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = createdAtSchema.parse(createdAt)
        this.configId = uuidSchema.parse(configId)
    }
}
