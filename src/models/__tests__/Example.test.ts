import { describe, expect, it } from 'vitest'
import Example from '../Example'

describe('Example class', () => {
    it('should have expected properties', () => {
        const model = new Example()
        expect(model).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                createdAt: expect.any(Number),
                name: 'Example',
                desc: '',
                tags: expect.any(Array),
                activated: expect.any(Boolean),
                favorited: expect.any(Boolean),
            }),
        )
        expect(Object.keys(model)).toHaveLength(8)
    })
})
