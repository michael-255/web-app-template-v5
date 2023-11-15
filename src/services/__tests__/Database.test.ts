import { Example, Log, Setting } from '@/models'
import { Enum } from '@/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DatabaseApi, DatabaseTables } from '../Database'

const getSpy = vi.fn()
const addSpy = vi.fn()
const putSpy = vi.fn()
const toArraySpy = vi.fn()
const bulkDeleteSpy = vi.fn()

const databaseTablesMock = {
    settings: {
        get: getSpy,
        put: putSpy,
    },
    logs: {
        add: addSpy,
        toArray: toArraySpy,
        bulkDelete: bulkDeleteSpy,
    },
    examples: vi.fn(),
} as any as DatabaseTables

describe('Database service', () => {
    describe('DatabaseTables class', () => {
        const dbt = new DatabaseTables('test')

        it.concurrent('should have expected primary keys and indexes for each table', () => {
            expect(dbt._dbSchema.settings.primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'key',
                multi: false,
                name: 'key',
                src: 'key',
                unique: true,
            })
            expect(dbt._dbSchema.logs.primKey).toEqual({
                auto: true,
                compound: false,
                keyPath: 'autoId',
                multi: false,
                name: 'autoId',
                src: '++autoId',
                unique: false,
            })
            expect(dbt._dbSchema.examples.primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'id',
                multi: false,
                name: 'id',
                src: 'id',
                unique: true,
            })
            expect(dbt._dbSchema.examples.idxByName).toEqual({
                createdAt: {
                    auto: false,
                    compound: false,
                    keyPath: 'createdAt',
                    multi: false,
                    name: 'createdAt',
                    src: 'createdAt',
                    unique: false,
                },
                tags: {
                    auto: false,
                    compound: false,
                    keyPath: 'tags',
                    multi: true,
                    name: 'tags',
                    src: '*tags',
                    unique: false,
                },
                type: {
                    auto: false,
                    compound: false,
                    keyPath: 'type',
                    multi: false,
                    name: 'type',
                    src: 'type',
                    unique: false,
                },
            })
        })

        it.concurrent('should have expected classes mapped to each table', () => {
            expect(dbt._dbSchema.settings.mappedClass).toBe(Setting)
            expect(dbt._dbSchema.logs.mappedClass).toBe(Log)
            expect(dbt._dbSchema.examples.mappedClass).toBe(Example)
        })
    })

    describe('DatabaseApi class', () => {
        const DB = new DatabaseApi(databaseTablesMock)

        beforeEach(() => {
            vi.resetAllMocks()
        })

        describe('initSettings()', () => {
            it('should default the settings if none exist', async () => {
                const instructionsOverlaySetting = new Setting(Enum.SettingKey.INSTRUCTIONS_OVERLAY, true)
                const consoleLogsSetting = new Setting(Enum.SettingKey.CONSOLE_LOGS, false)
                const infoMessagesSetting = new Setting(Enum.SettingKey.INFO_MESSAGES, true)
                const logRetentionDurationSetting = new Setting(
                    Enum.SettingKey.LOG_RETENTION_DURATION,
                    Enum.Duration['Six Months'],
                )
                getSpy.mockResolvedValueOnce(undefined)
                getSpy.mockResolvedValueOnce(undefined)
                getSpy.mockResolvedValueOnce(undefined)
                getSpy.mockResolvedValueOnce(undefined)
                putSpy.mockResolvedValueOnce('1')
                putSpy.mockResolvedValueOnce('2')
                putSpy.mockResolvedValueOnce('3')
                putSpy.mockResolvedValueOnce('4')
                const res = await DB.initSettings()
                expect(getSpy).toBeCalledTimes(4)
                expect(putSpy).toBeCalledTimes(4)
                expect(getSpy).toHaveBeenNthCalledWith(1, Enum.SettingKey.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, Enum.SettingKey.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(3, Enum.SettingKey.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(4, Enum.SettingKey.LOG_RETENTION_DURATION)
                expect(putSpy).toHaveBeenNthCalledWith(1, instructionsOverlaySetting)
                expect(putSpy).toHaveBeenNthCalledWith(2, consoleLogsSetting)
                expect(putSpy).toHaveBeenNthCalledWith(3, infoMessagesSetting)
                expect(putSpy).toHaveBeenNthCalledWith(4, logRetentionDurationSetting)
                expect(res).toEqual([
                    instructionsOverlaySetting,
                    consoleLogsSetting,
                    infoMessagesSetting,
                    logRetentionDurationSetting,
                ])
            })

            it('should use existing settings if some are found', async () => {
                const instructionsOverlaySetting = new Setting(Enum.SettingKey.INSTRUCTIONS_OVERLAY, true) // Default
                const consoleLogsSetting = new Setting(Enum.SettingKey.CONSOLE_LOGS, 'not-the-real-default')
                const infoMessagesSetting = new Setting(Enum.SettingKey.INFO_MESSAGES, 'not-the-real-default')
                const logRetentionDurationSetting = new Setting(
                    Enum.SettingKey.LOG_RETENTION_DURATION,
                    'not-the-real-default',
                )
                getSpy.mockResolvedValueOnce(undefined) // This will get defaulted
                getSpy.mockResolvedValueOnce(consoleLogsSetting)
                getSpy.mockResolvedValueOnce(infoMessagesSetting)
                getSpy.mockResolvedValueOnce(logRetentionDurationSetting)
                putSpy.mockResolvedValueOnce('1')
                putSpy.mockResolvedValueOnce('2')
                putSpy.mockResolvedValueOnce('3')
                putSpy.mockResolvedValueOnce('4')
                const res = await DB.initSettings()
                expect(getSpy).toBeCalledTimes(4)
                expect(putSpy).toBeCalledTimes(4)
                expect(getSpy).toHaveBeenNthCalledWith(1, Enum.SettingKey.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, Enum.SettingKey.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(3, Enum.SettingKey.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(4, Enum.SettingKey.LOG_RETENTION_DURATION)
                expect(putSpy).toHaveBeenNthCalledWith(1, instructionsOverlaySetting)
                expect(putSpy).toHaveBeenNthCalledWith(2, consoleLogsSetting)
                expect(putSpy).toHaveBeenNthCalledWith(3, infoMessagesSetting)
                expect(putSpy).toHaveBeenNthCalledWith(4, logRetentionDurationSetting)
                expect(res).toEqual([
                    instructionsOverlaySetting,
                    consoleLogsSetting,
                    infoMessagesSetting,
                    logRetentionDurationSetting,
                ])
            })
        })

        describe('getSetting()', () => {
            it('should return the setting if it exists', async () => {
                const setting = {
                    key: Enum.SettingKey.CONSOLE_LOGS,
                    value: true,
                }
                getSpy.mockResolvedValue(setting)
                const res = await DB.getSetting(setting.key)
                expect(getSpy).toBeCalledWith('console-logs')
                expect(res).toBe(setting)
            })

            it('should return undefined if no setting exists', async () => {
                getSpy.mockResolvedValue(undefined)
                const res = await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS)
                expect(getSpy).toBeCalledWith('console-logs')
                expect(res).toBe(undefined)
            })
        })

        describe('purgeLogs()', () => {
            it('should purge logs that are beyond the retention duration', async () => {
                const logRetentionDurationSetting = new Setting(
                    Enum.SettingKey.LOG_RETENTION_DURATION,
                    Enum.Duration.Now, // Purging logs right away for the test
                )
                const log1: Log = {
                    autoId: 1,
                    createdAt: Date.now() - 10, // Force delete because this log is older
                    logLevel: Enum.LogLevel.DEBUG,
                    label: 'Test DEBUG Log 1',
                    details: undefined,
                    errorMessage: undefined,
                    stackTrace: undefined,
                }
                const log2: Log = {
                    autoId: 2,
                    createdAt: Date.now() + 10, // Don't delete
                    logLevel: Enum.LogLevel.INFO,
                    label: 'Test INFO Log 2',
                    details: undefined,
                    errorMessage: undefined,
                    stackTrace: undefined,
                }
                getSpy.mockResolvedValue(logRetentionDurationSetting)
                toArraySpy.mockResolvedValue([log1, log2])
                bulkDeleteSpy.mockResolvedValue(undefined)
                const res = await DB.purgeLogs()
                expect(getSpy).toBeCalledWith(Enum.SettingKey.LOG_RETENTION_DURATION)
                expect(toArraySpy).toHaveBeenCalled()
                expect(bulkDeleteSpy).toHaveBeenCalledWith([log1.autoId])
                expect(res).toBe(1)
            })
        })

        describe('addLog()', () => {
            const label = 'Test Error'
            const logLevel = Enum.LogLevel.DEBUG
            const errorDetails = new Error(label)
            const customDetails = {
                data: 'test',
                count: 1,
            }

            it('should add log without details', async () => {
                addSpy.mockResolvedValueOnce(1)

                const res = await DB.addLog(logLevel, label)

                expect(addSpy).toBeCalledWith(
                    expect.objectContaining({
                        autoId: undefined,
                        createdAt: expect.any(Number),
                        logLevel,
                        label,
                        details: undefined,
                        errorMessage: undefined,
                        stackTrace: undefined,
                    }),
                )
                expect(res).toBe(1)
            })

            it('should add log with error fields if details is an error', async () => {
                addSpy.mockResolvedValueOnce(1)

                const res = await DB.addLog(logLevel, label, errorDetails)

                expect(addSpy).toBeCalledWith(
                    expect.objectContaining({
                        autoId: undefined,
                        createdAt: expect.any(Number),
                        logLevel,
                        label,
                        details: undefined,
                        errorMessage: label,
                        stackTrace: expect.any(String),
                    }),
                )
                expect(res).toBe(1)
            })

            it('should add log with custom details if provided', async () => {
                addSpy.mockResolvedValueOnce(1)

                const res = await DB.addLog(logLevel, label, customDetails)

                expect(addSpy).toBeCalledWith(
                    expect.objectContaining({
                        autoId: undefined,
                        createdAt: expect.any(Number),
                        logLevel,
                        label,
                        details: customDetails,
                        errorMessage: undefined,
                        stackTrace: undefined,
                    }),
                )
                expect(res).toBe(1)
            })
        })
    })
})
