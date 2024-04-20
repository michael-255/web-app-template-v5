import Example from '@/models/Example'
import { TagEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Example class', () => {
    it('should have expected properties', () => {
        const model = new Example()
        expect(model).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                createdAt: expect.any(Number),
                name: 'My Example',
                desc: '',
                tags: expect.arrayContaining([TagEnum.ENABLED]),
                lastChild: undefined,
            }),
        )
        expect(Object.keys(model)).toHaveLength(6)
    })
})
