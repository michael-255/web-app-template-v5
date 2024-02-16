import ExampleConfig from '@/models/ExampleConfig'
import { describe, expect, it } from 'vitest'

describe('ExampleConfig class', () => {
    it('should have expected properties', () => {
        const model = new ExampleConfig()
        expect(model).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                createdAt: expect.any(Number),
                name: 'Example',
                desc: '',
                tags: expect.any(Array),
            }),
        )
    })
})
