import { Example } from '@/models/Example'
import { Schema } from '@/shared'
import { describe, expect, it } from 'vitest'

describe('Example', () => {
    it('should have correct properties', () => {
        const example = new Example()
        expect(example).toHaveProperty('id')
        expect(example).toHaveProperty('createdAt')
        expect(example).toHaveProperty('name')
        expect(example).toHaveProperty('desc')
        expect(example).toHaveProperty('tags')
        expect(example).toHaveProperty('data')
    })

    it('should have correct default values', () => {
        const example = new Example()
        expect(Schema.uuid.safeParse(example.id).success).toBe(true)
        expect(example.createdAt).toBeGreaterThan(Date.now() - 1000)
        expect(example.name).toBe('Example')
        expect(example.desc).toBe('')
        expect(example.tags).toEqual([])
        expect(example.data).toEqual([])
    })
})
