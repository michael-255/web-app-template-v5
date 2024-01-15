import { ExampleConfig } from '@/models/ExampleConfig'
import { Schema } from '@/shared'
import { describe, expect, it } from 'vitest'

describe('ExampleConfig class', () => {
    it('should have expected properties', () => {
        const model = new ExampleConfig()
        expect(model).toHaveProperty('id')
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('name')
        expect(model).toHaveProperty('desc')
        expect(model).toHaveProperty('tags')
    })

    it('should have expected default values', () => {
        const model = new ExampleConfig()
        expect(Schema.uuid.safeParse(model.id).success).toBe(true)
        expect(model.createdAt).toBeGreaterThan(Date.now() - 1000)
        expect(model.name).toBe('Example Config')
        expect(model.desc).toBe('')
        expect(model.tags).toEqual([])
    })
})
