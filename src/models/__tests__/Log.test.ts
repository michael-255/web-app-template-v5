import Log from '@/models/Log'
import { LogLevelEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Log class', () => {
    it('should have expected properties when using details', () => {
        const model = new Log(LogLevelEnum.DEBUG, 'Test', {})
        // AutoId is set by Dexie when the record is saved in the DB
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('logLevel')
        expect(model).toHaveProperty('label')
        expect(model).toHaveProperty('details')
    })

    it('should have expected properties when using errors', () => {
        const model = new Log(LogLevelEnum.DEBUG, 'Test', new Error('TEST'))
        // AutoId is set by Dexie when the record is saved in the DB
        expect(model).toHaveProperty('createdAt')
        expect(model).toHaveProperty('logLevel')
        expect(model).toHaveProperty('label')
        expect(model).toHaveProperty('errorMessage')
        expect(model).toHaveProperty('stackTrace')
    })
})
