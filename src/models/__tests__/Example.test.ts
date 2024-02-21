import { describe, expect, it } from 'vitest'
import Example from '../Example'

describe('Example class', () => {
    it('should have expected properties', () => {
        const model = new Example()
        expect(model).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                createdAt: expect.any(Number),
                name: 'My Example',
                desc: '',
                tags: expect.any(Array),
                locked: expect.any(Boolean),
                favorited: expect.any(Boolean),
                lastChildCreatedAt: undefined,
                lastChildNote: '',
            }),
        )
        expect(Object.keys(model)).toHaveLength(10)
    })
})
