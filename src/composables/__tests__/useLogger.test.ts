import useLogger from '@/composables/useLogger'
import Log from '@/models/Log'
import { TableEnum, LogLevelEnum } from '@/shared/enums'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Required for these spys to work with vi.mock()
const spys = vi.hoisted(() => ({
    notify: vi.fn(),
    getPaletteColor: vi.fn(),
    consoleLog: vi.fn(),
    consoleWarn: vi.fn(),
    consoleError: vi.fn(),
    getRecord: vi.fn(),
    addRecord: vi.fn(),
}))

vi.mock('quasar', () => ({
    uid: vi.fn(() => 'test-uid'),
    useQuasar: () => ({
        notify: spys.notify,
    }),
    colors: {
        getPaletteColor: spys.getPaletteColor,
    },
}))

vi.mock('../../services/Database.ts', () => ({
    default: {
        getRecord: spys.getRecord,
        addRecord: spys.addRecord,
    },
}))

vi.stubGlobal('console', {
    log: spys.consoleLog,
    warn: spys.consoleWarn,
    error: spys.consoleError,
})

const loggerNameRegex = /^%c.*$/
const loggerStyleRegex =
    /^border-radius: \d{1}px; padding: \d{1}px \d{1}px; color: white; background-color: #([0-9a-fA-F]{3}){1,2};$/
const logLevelRegex = /^\[(DEBUG|INFO|WARN|ERROR)\]$/
const message = 'Test logger message'
const details = { data: 'test' }

describe('useLogger composable', () => {
    let log: ReturnType<typeof useLogger>['log']

    beforeEach(() => {
        vi.resetAllMocks()
        spys.getPaletteColor.mockImplementation(() => '#123456')
        log = useLogger().log // Must be called after any spy alterations to reinitialize the log object
    })

    it.concurrent('should return the log object with logging functions', () => {
        expect(typeof log).toBe('object')
        expect(typeof log.print).toBe('function')
        expect(typeof log.silentDebug).toBe('function')
        expect(typeof log.debug).toBe('function')
        expect(typeof log.info).toBe('function')
        expect(typeof log.warn).toBe('function')
        expect(typeof log.error).toBe('function')
    })

    describe('log.print | log.silentDebug | log.debug', () => {
        it('should console.log when log.print is called', () => {
            log.print(message, details)
            expect(spys.consoleLog).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                message,
                details,
            )
        })

        it('should console.log when log.silentDebug is called', () => {
            if (!import.meta.env.DEV) {
                return // Passing debug related tests automatically in production
            }
            log.silentDebug(message, details)

            expect(spys.consoleLog).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
        })

        it('should console.log and notify when log.debug is called', () => {
            if (!import.meta.env.DEV) {
                return // Passing debug related tests automatically in production
            }
            log.debug(message, details)

            expect(spys.consoleLog).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'accent',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.info', () => {
        it('should console.log and notify when log.info is called with CONSOLE_LOGS and INFO_MESSAGES set to true', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: true })
            spys.getRecord.mockResolvedValueOnce({ value: true })

            await log.info(message, details)

            expect(spys.consoleLog).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.INFO, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })

        it('should console.log only when log.info is called with INFO_MESSAGES set to false', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: true })
            spys.getRecord.mockResolvedValueOnce({ value: false })

            await log.info(message, details)

            expect(spys.consoleLog).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.INFO, message, details),
            )
            expect(spys.notify).not.toHaveBeenCalled()
        })

        it('should notify only when log.info is called with CONSOLE_LOGS set to false', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: false })
            spys.getRecord.mockResolvedValueOnce({ value: true })

            await log.info(message, details)

            expect(spys.consoleLog).not.toHaveBeenCalled()
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.INFO, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })

        it('should be silent when log.info is called with CONSOLE_LOGS and INFO_MESSAGES set to false', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: false })
            spys.getRecord.mockResolvedValueOnce({ value: true })

            await log.info(message, details)

            expect(spys.consoleLog).not.toHaveBeenCalled()
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.INFO, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.warn', () => {
        it('should console.warn and notify when log.warn is called with CONSOLE_LOGS set to true', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: true })

            await log.warn(message, details)

            expect(spys.consoleWarn).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.WARN, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'warning',
                icon: expect.any(String),
                message,
            })
        })

        it('should notify when log.warn is called with CONSOLE_LOGS set to false', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: false })

            await log.warn(message, details)

            expect(spys.consoleWarn).not.toHaveBeenCalled()
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.WARN, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'warning',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.error', () => {
        it('should console.error and notify when log.error is called with CONSOLE_LOGS set to true', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: true })

            await log.error(message, details)

            expect(spys.consoleError).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.ERROR, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'negative',
                icon: expect.any(String),
                message,
            })
        })

        it('should notify when log.error is called with CONSOLE_LOGS set to false', async () => {
            spys.getRecord.mockResolvedValueOnce({ value: false })

            await log.error(message, details)

            expect(spys.consoleError).not.toHaveBeenCalled()
            expect(spys.addRecord).toHaveBeenCalledWith(
                TableEnum.LOGS,
                new Log(LogLevelEnum.ERROR, message, details),
            )
            expect(spys.notify).toHaveBeenCalledWith({
                color: 'negative',
                icon: expect.any(String),
                message,
            })
        })
    })
})
