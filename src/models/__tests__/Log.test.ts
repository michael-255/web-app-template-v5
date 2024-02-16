import Log from '@/models/Log'
import { LogLevelEnum } from '@/shared/enums'
import { describe, expect, it } from 'vitest'

describe('Log class', () => {
    it('should have expected properties when using details', () => {
        const model = new Log(LogLevelEnum.DEBUG, 'Test', {})
        expect(model).toEqual(
            expect.objectContaining({
                autoId: undefined,
                createdAt: expect.any(Number),
                logLevel: LogLevelEnum.DEBUG,
                label: 'Test',
                details: expect.any(Object),
            }),
        )
        expect(Object.keys(model)).toHaveLength(5)
    })

    it('should have expected properties when using errors', () => {
        const model = new Log(LogLevelEnum.DEBUG, 'Test', new Error('TEST'))
        expect(model).toEqual(
            expect.objectContaining({
                autoId: undefined,
                createdAt: expect.any(Number),
                logLevel: LogLevelEnum.DEBUG,
                label: 'Test',
                details: expect.objectContaining({
                    name: 'Error',
                    message: 'TEST',
                    stack: expect.any(String),
                }),
            }),
        )
        expect(Object.keys(model)).toHaveLength(5)
    })
})
