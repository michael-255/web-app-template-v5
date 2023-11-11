import { useLogger } from '@/composables/useLogger'
import { Enum } from '@/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'

// Required for these spys work with vi.mock()
const spys = vi.hoisted(() => ({
    notifySpy: vi.fn(),
    getPaletteColorSpy: vi.fn(),
    consoleLogSpy: vi.fn(),
    consoleWarnSpy: vi.fn(),
    consoleErrorSpy: vi.fn(),
    getSettingValueSpy: vi.fn(),
    addLogSpy: vi.fn(),
}))

vi.mock('quasar', () => ({
    useQuasar: () => ({
        notify: spys.notifySpy,
    }),
    colors: {
        getPaletteColor: spys.getPaletteColorSpy,
    },
}))

vi.mock('../../services/Database.ts', () => ({
    default: {
        getSettingValue: spys.getSettingValueSpy,
        addLog: spys.addLogSpy,
    },
}))

vi.stubGlobal('console', {
    log: spys.consoleLogSpy,
    warn: spys.consoleWarnSpy,
    error: spys.consoleErrorSpy,
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
        spys.getPaletteColorSpy.mockImplementation(() => '#123456')
        log = useLogger().log // Must be called after any spy alterations
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
            expect(spys.consoleLogSpy).toHaveBeenCalledWith(
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

            expect(spys.consoleLogSpy).toHaveBeenCalledWith(
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

            expect(spys.consoleLogSpy).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'accent',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.info', () => {
        it('should console.log and notify when log.info is called with CONSOLE_LOGS and INFO_MESSAGES set to true', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => true)
            spys.getSettingValueSpy.mockImplementationOnce(() => true)

            await log.info(message, details)

            expect(spys.consoleLogSpy).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.INFO, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })

        it('should console.log only when log.info is called with INFO_MESSAGES set to false', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => true)
            spys.getSettingValueSpy.mockImplementationOnce(() => false)

            await log.info(message, details)

            expect(spys.consoleLogSpy).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.INFO, message, details)
            expect(spys.notifySpy).not.toHaveBeenCalled()
        })

        it('should notify only when log.info is called with CONSOLE_LOGS set to false', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => false)
            spys.getSettingValueSpy.mockImplementationOnce(() => true)

            await log.info(message, details)

            expect(spys.consoleLogSpy).not.toHaveBeenCalled()
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.INFO, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })

        it('should be silent when log.info is called with CONSOLE_LOGS and INFO_MESSAGES set to false', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => false)
            spys.getSettingValueSpy.mockImplementationOnce(() => true)

            await log.info(message, details)

            expect(spys.consoleLogSpy).not.toHaveBeenCalled()
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.INFO, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'info',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.warn', () => {
        it('should console.warn and notify when log.warn is called with CONSOLE_LOGS set to true', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => true)

            await log.warn(message, details)

            expect(spys.consoleWarnSpy).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.WARN, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'warning',
                icon: expect.any(String),
                message,
            })
        })

        it('should notify when log.warn is called with CONSOLE_LOGS set to false', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => false)

            await log.warn(message, details)

            expect(spys.consoleWarnSpy).not.toHaveBeenCalled()
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.WARN, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'warning',
                icon: expect.any(String),
                message,
            })
        })
    })

    describe('log.error', () => {
        it('should console.error and notify when log.error is called with CONSOLE_LOGS set to true', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => true)

            await log.error(message, details)

            expect(spys.consoleErrorSpy).toHaveBeenCalledWith(
                expect.stringMatching(loggerNameRegex),
                expect.stringMatching(loggerStyleRegex),
                expect.stringMatching(logLevelRegex),
                message,
                details,
            )
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.ERROR, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'negative',
                icon: expect.any(String),
                message,
            })
        })

        it('should notify when log.error is called with CONSOLE_LOGS set to false', async () => {
            spys.getSettingValueSpy.mockImplementationOnce(() => false)

            await log.error(message, details)

            expect(spys.consoleErrorSpy).not.toHaveBeenCalled()
            expect(spys.addLogSpy).toHaveBeenCalledWith(Enum.LogLevel.ERROR, message, details)
            expect(spys.notifySpy).toHaveBeenCalledWith({
                color: 'negative',
                icon: expect.any(String),
                message,
            })
        })
    })
})
