import Log from '@/models/Log'
import { LogLevelEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Log class', () => {
    it('should have expected properties', () => {
        const model = new Log(LogLevelEnum.DEBUG, 'Test', {})
        model.autoId = 1 // Normally set by Dexie when the record is saved
        model.errorMessage = 'Test error message' // Normally set by the error object
        model.stackTrace = 'Test stack trace' // Normally set by the error object
        expect(model).toHaveProperty('autoId')
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('logLevel')
        expect(model).toHaveProperty('label')
        expect(model).toHaveProperty('details')
        expect(model).toHaveProperty('errorMessage')
        expect(model).toHaveProperty('stackTrace')
    })
})
