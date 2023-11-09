import { Example } from '@/models/Example'
import { Schema } from '@/shared'
import { describe, expect, it } from 'vitest'

describe('Example', () => {
    it('should have expected properties', () => {
        const model = new Example()
        expect(model).toHaveProperty('id')
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('name')
        expect(model).toHaveProperty('desc')
        expect(model).toHaveProperty('tags')
        expect(model).toHaveProperty('data')
    })

    it('should have expected default values', () => {
        const model = new Example()
        expect(Schema.uuid.safeParse(model.id).success).toBe(true)
        expect(model.createdAt).toBeGreaterThan(Date.now() - 1000)
        expect(model.name).toBe('Example')
        expect(model.desc).toBe('')
        expect(model.tags).toEqual([])
        expect(model.data).toEqual([])
    })
})
