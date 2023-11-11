import { Log } from '@/models'
import { Enum } from '@/shared'
import { describe, expect, it } from 'vitest'

describe('Log class', () => {
    it('should have expected properties', () => {
        const model = new Log(Enum.LogLevel.DEBUG, 'Test', {})
        expect(model).toHaveProperty('autoId')
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('logLevel')
        expect(model).toHaveProperty('label')
        expect(model).toHaveProperty('extraDetails')
        expect(model).toHaveProperty('errorMessage')
        expect(model).toHaveProperty('stackTrace')
    })
})
