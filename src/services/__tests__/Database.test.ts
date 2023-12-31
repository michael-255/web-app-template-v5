import { Example, Log, Setting } from '@/models'
import { Constant, Enum } from '@/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DatabaseApi, DatabaseTables } from '../Database'

const getSpy = vi.fn()
const addSpy = vi.fn()
const putSpy = vi.fn()
const toArraySpy = vi.fn()
const bulkDeleteSpy = vi.fn()
const deleteDatabaseSpy = vi.fn()
const clearSpy = vi.fn()

const databaseTablesMock = {
    [Enum.DBTable.SETTINGS]: {
        get: getSpy,
        put: putSpy,
        toArray: toArraySpy,
        clear: clearSpy,
    },
    [Enum.DBTable.LOGS]: {
        add: addSpy,
        toArray: toArraySpy,
        bulkDelete: bulkDeleteSpy,
        clear: clearSpy,
    },
    [Enum.DBTable.EXAMPLE_CONFIGS]: {
        toArray: toArraySpy,
        clear: clearSpy,
    },
    [Enum.DBTable.EXAMPLE_RESULTS]: {
        toArray: toArraySpy,
        clear: clearSpy,
    },
    delete: deleteDatabaseSpy,
    examples: vi.fn(),
} as any as DatabaseTables

describe('Database service', () => {
    describe('DatabaseTables class', () => {
        const dbt = new DatabaseTables('test')

        it.concurrent('should have expected primary keys and indexes for each table', () => {
            // Primary key is only key, so this is only expect needed
            expect(dbt._dbSchema.settings.primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'key',
                multi: false,
                name: 'key',
                src: 'key',
                unique: true,
            })
            // Primary key is only key, so this is only expect needed
            expect(dbt._dbSchema.logs.primKey).toEqual({
                auto: true,
                compound: false,
                keyPath: 'autoId',
                multi: false,
                name: 'autoId',
                src: '++autoId',
                unique: false,
            })
            expect(dbt._dbSchema.exampleConfigs.primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'id',
                multi: false,
                name: 'id',
                src: 'id',
                unique: true,
            })
            expect(dbt._dbSchema.exampleConfigs.idxByName).toEqual({
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
            expect(dbt._dbSchema.exampleResults.primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'id',
                multi: false,
                name: 'id',
                src: 'id',
                unique: true,
            })
            expect(dbt._dbSchema.exampleResults.idxByName).toEqual({
                configId: {
                    auto: false,
                    compound: false,
                    keyPath: 'configId',
                    multi: false,
                    name: 'configId',
                    src: 'configId',
                    unique: false,
                },
                createdAt: {
                    auto: false,
                    compound: false,
                    keyPath: 'createdAt',
                    multi: false,
                    name: 'createdAt',
                    src: 'createdAt',
                    unique: false,
                },
            })
        })

        it.concurrent('should have expected classes mapped to each table', () => {
            expect(dbt._dbSchema.settings.mappedClass).toBe(Setting)
            expect(dbt._dbSchema.logs.mappedClass).toBe(Log)
            expect(dbt._dbSchema.exampleConfigs.mappedClass).toBe(Example) // TODO
            expect(dbt._dbSchema.exampleResults.mappedClass).toBe(Example) // TODO
        })
    })

    describe('DatabaseApi class', () => {
        const DB = new DatabaseApi(databaseTablesMock)

        beforeEach(() => {
            vi.resetAllMocks()
        })

        describe('initSettings()', () => {
            it('should default the settings if none exist', async () => {
                const instructionsOverlaySetting = new Setting(
                    Enum.SettingKey.INSTRUCTIONS_OVERLAY,
                    true,
                )
                const advancedModeSetting = new Setting(Enum.SettingKey.ADVANCED_MODE, false)
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
                getSpy.mockResolvedValueOnce(undefined)
                putSpy.mockResolvedValueOnce('1')
                putSpy.mockResolvedValueOnce('2')
                putSpy.mockResolvedValueOnce('3')
                putSpy.mockResolvedValueOnce('4')
                putSpy.mockResolvedValueOnce('5')
                const res = await DB.initSettings()
                expect(getSpy).toBeCalledTimes(5)
                expect(putSpy).toBeCalledTimes(5)
                expect(getSpy).toHaveBeenNthCalledWith(1, Enum.SettingKey.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, Enum.SettingKey.ADVANCED_MODE)
                expect(getSpy).toHaveBeenNthCalledWith(3, Enum.SettingKey.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(4, Enum.SettingKey.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(5, Enum.SettingKey.LOG_RETENTION_DURATION)
                expect(putSpy).toHaveBeenNthCalledWith(1, instructionsOverlaySetting)
                expect(putSpy).toHaveBeenNthCalledWith(2, advancedModeSetting)
                expect(putSpy).toHaveBeenNthCalledWith(3, consoleLogsSetting)
                expect(putSpy).toHaveBeenNthCalledWith(4, infoMessagesSetting)
                expect(putSpy).toHaveBeenNthCalledWith(5, logRetentionDurationSetting)
                expect(res).toEqual([
                    instructionsOverlaySetting,
                    advancedModeSetting,
                    consoleLogsSetting,
                    infoMessagesSetting,
                    logRetentionDurationSetting,
                ])
            })

            it('should use existing settings if some are found', async () => {
                const instructionsOverlaySetting = new Setting(
                    Enum.SettingKey.INSTRUCTIONS_OVERLAY,
                    true,
                ) // Default
                const advancedModeSetting = new Setting(Enum.SettingKey.ADVANCED_MODE, false) // Default
                const consoleLogsSetting = new Setting(
                    Enum.SettingKey.CONSOLE_LOGS,
                    'not-the-real-default',
                )
                const infoMessagesSetting = new Setting(
                    Enum.SettingKey.INFO_MESSAGES,
                    'not-the-real-default',
                )
                const logRetentionDurationSetting = new Setting(
                    Enum.SettingKey.LOG_RETENTION_DURATION,
                    'not-the-real-default',
                )
                getSpy.mockResolvedValueOnce(undefined) // This will get defaulted
                getSpy.mockResolvedValueOnce(undefined) // This will get defaulted
                getSpy.mockResolvedValueOnce(consoleLogsSetting)
                getSpy.mockResolvedValueOnce(infoMessagesSetting)
                getSpy.mockResolvedValueOnce(logRetentionDurationSetting)
                putSpy.mockResolvedValueOnce('1')
                putSpy.mockResolvedValueOnce('2')
                putSpy.mockResolvedValueOnce('3')
                putSpy.mockResolvedValueOnce('4')
                putSpy.mockResolvedValueOnce('5')
                const res = await DB.initSettings()
                expect(getSpy).toBeCalledTimes(5)
                expect(putSpy).toBeCalledTimes(5)
                expect(getSpy).toHaveBeenNthCalledWith(1, Enum.SettingKey.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, Enum.SettingKey.ADVANCED_MODE)
                expect(getSpy).toHaveBeenNthCalledWith(3, Enum.SettingKey.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(4, Enum.SettingKey.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(5, Enum.SettingKey.LOG_RETENTION_DURATION)
                expect(putSpy).toHaveBeenNthCalledWith(1, instructionsOverlaySetting)
                expect(putSpy).toHaveBeenNthCalledWith(2, advancedModeSetting)
                expect(putSpy).toHaveBeenNthCalledWith(3, consoleLogsSetting)
                expect(putSpy).toHaveBeenNthCalledWith(4, infoMessagesSetting)
                expect(putSpy).toHaveBeenNthCalledWith(5, logRetentionDurationSetting)
                expect(res).toEqual([
                    instructionsOverlaySetting,
                    advancedModeSetting,
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

        // describe('liveSettings()', () => {
        //     it('should return a live query of all settings', async () => {
        //         const settings = [
        //             new Setting(Enum.SettingKey.INSTRUCTIONS_OVERLAY, true),
        //             new Setting(Enum.SettingKey.ADVANCED_MODE, false),
        //             new Setting(Enum.SettingKey.CONSOLE_LOGS, false),
        //             new Setting(Enum.SettingKey.INFO_MESSAGES, true),
        //             new Setting(
        //                 Enum.SettingKey.LOG_RETENTION_DURATION,
        //                 Enum.Duration['Six Months'],
        //             ),
        //         ]
        //         toArraySpy.mockResolvedValue(settings)
        //         const res = await DB.liveSettings()
        //         expect(toArraySpy).toHaveBeenCalled()
        //         expect(res).toEqual(settings)
        //     })
        // })

        describe('getBackupData()', () => {
            it('should return all data from the DB for the backup', async () => {
                toArraySpy.mockResolvedValueOnce([1])
                toArraySpy.mockResolvedValueOnce([2])
                toArraySpy.mockResolvedValueOnce([3])
                toArraySpy.mockResolvedValueOnce([4])

                const res = await DB.getBackupData()

                expect(toArraySpy).toBeCalledTimes(4)
                expect(res).toEqual({
                    appName: Constant.AppName,
                    databaseVersion: Constant.AppDatabaseVersion,
                    createdAt: expect.any(Number),
                    [Enum.DBTable.SETTINGS]: [1],
                    [Enum.DBTable.LOGS]: [2],
                    [Enum.DBTable.EXAMPLE_CONFIGS]: [3],
                    [Enum.DBTable.EXAMPLE_RESULTS]: [4],
                })
            })
        })

        describe('clearAppData()', () => {
            it('should clear each table and re-init the settings', async () => {
                clearSpy.mockResolvedValueOnce(undefined)
                clearSpy.mockResolvedValueOnce(undefined)
                clearSpy.mockResolvedValueOnce(undefined)
                clearSpy.mockResolvedValueOnce(undefined)

                const res = await DB.clearAppData()

                expect(clearSpy).toBeCalledTimes(4)
                // Expecting the default settings to be re-initialized in this test
                expect(res).toEqual([
                    {
                        key: Enum.SettingKey.INSTRUCTIONS_OVERLAY,
                        value: true,
                    },
                    {
                        key: Enum.SettingKey.ADVANCED_MODE,
                        value: false,
                    },
                    {
                        key: Enum.SettingKey.CONSOLE_LOGS,
                        value: false,
                    },
                    {
                        key: Enum.SettingKey.INFO_MESSAGES,
                        value: true,
                    },
                    {
                        key: Enum.SettingKey.LOG_RETENTION_DURATION,
                        value: Enum.Duration[Enum.Duration['Six Months']],
                    },
                ])
            })
        })

        describe('deleteDatabase()', () => {
            it('should delete the database', async () => {
                deleteDatabaseSpy.mockResolvedValueOnce(undefined)

                const res = await DB.deleteDatabase()

                expect(deleteDatabaseSpy).toHaveBeenCalledOnce()
                expect(res).toBe(undefined)
            })
        })
    })
})
