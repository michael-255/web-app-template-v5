import ExampleConfig from '@/models/ExampleConfig'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { DatabaseApi, DatabaseTables } from '@/services/Database'
import { appDatabaseVersion, appName } from '@/shared/constants'
import { DBTableEnum, DurationEnum, LogLevelEnum, SettingKeyEnum } from '@/shared/enums'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const getSpy = vi.fn()
const addSpy = vi.fn()
const putSpy = vi.fn()
const bulkDeleteSpy = vi.fn()
const deleteDatabaseSpy = vi.fn()

const settingsToArraySpy = vi.fn()
const logsToArraySpy = vi.fn()
const exampleConfigsToArraySpy = vi.fn()
const exampleResultsToArraySpy = vi.fn()

const settingsClearSpy = vi.fn()
const logsClearSpy = vi.fn()
const exampleConfigsClearSpy = vi.fn()
const exampleResultsClearSpy = vi.fn()

const databaseTablesMock = {
    [DBTableEnum.SETTINGS]: {
        get: getSpy,
        put: putSpy,
        toArray: settingsToArraySpy,
        clear: settingsClearSpy,
    },
    [DBTableEnum.LOGS]: {
        add: addSpy,
        toArray: logsToArraySpy,
        bulkDelete: bulkDeleteSpy,
        clear: logsClearSpy,
    },
    [DBTableEnum.EXAMPLE_CONFIGS]: {
        toArray: exampleConfigsToArraySpy,
        clear: exampleConfigsClearSpy,
    },
    [DBTableEnum.EXAMPLE_RESULTS]: {
        toArray: exampleResultsToArraySpy,
        clear: exampleResultsClearSpy,
    },
    delete: deleteDatabaseSpy,
    examples: vi.fn(),
} as any as DatabaseTables

describe('Database service', () => {
    describe('DatabaseTables class', () => {
        const dbt = new DatabaseTables('test')

        it.concurrent('should have expected primary keys and indexes for each table', () => {
            // Primary key is only key, so this is only expect needed
            expect(dbt._dbSchema[DBTableEnum.SETTINGS].primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'key',
                multi: false,
                name: 'key',
                src: 'key',
                unique: true,
            })
            // Primary key is only key, so this is only expect needed
            expect(dbt._dbSchema[DBTableEnum.LOGS].primKey).toEqual({
                auto: true,
                compound: false,
                keyPath: 'autoId',
                multi: false,
                name: 'autoId',
                src: '++autoId',
                unique: false,
            })
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_CONFIGS].primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'id',
                multi: false,
                name: 'id',
                src: 'id',
                unique: true,
            })
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_CONFIGS].idxByName).toEqual({
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
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_RESULTS].primKey).toEqual({
                auto: false,
                compound: false,
                keyPath: 'id',
                multi: false,
                name: 'id',
                src: 'id',
                unique: true,
            })
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_RESULTS].idxByName).toEqual({
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
            expect(dbt._dbSchema[DBTableEnum.SETTINGS].mappedClass).toBe(Setting)
            expect(dbt._dbSchema[DBTableEnum.LOGS].mappedClass).toBe(Log)
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_CONFIGS].mappedClass).toBe(ExampleConfig)
            expect(dbt._dbSchema[DBTableEnum.EXAMPLE_RESULTS].mappedClass).toBe(ExampleResult)
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
                    SettingKeyEnum.INSTRUCTIONS_OVERLAY,
                    true,
                )
                const advancedModeSetting = new Setting(SettingKeyEnum.ADVANCED_MODE, false)
                const consoleLogsSetting = new Setting(SettingKeyEnum.CONSOLE_LOGS, false)
                const infoMessagesSetting = new Setting(SettingKeyEnum.INFO_MESSAGES, true)
                const logRetentionDurationSetting = new Setting(
                    SettingKeyEnum.LOG_RETENTION_DURATION,
                    DurationEnum['Six Months'],
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
                expect(getSpy).toHaveBeenNthCalledWith(1, SettingKeyEnum.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, SettingKeyEnum.ADVANCED_MODE)
                expect(getSpy).toHaveBeenNthCalledWith(3, SettingKeyEnum.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(4, SettingKeyEnum.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(5, SettingKeyEnum.LOG_RETENTION_DURATION)
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
                    SettingKeyEnum.INSTRUCTIONS_OVERLAY,
                    true,
                ) // Default
                const advancedModeSetting = new Setting(SettingKeyEnum.ADVANCED_MODE, false) // Default
                const consoleLogsSetting = new Setting(
                    SettingKeyEnum.CONSOLE_LOGS,
                    'not-the-real-default',
                )
                const infoMessagesSetting = new Setting(
                    SettingKeyEnum.INFO_MESSAGES,
                    'not-the-real-default',
                )
                const logRetentionDurationSetting = new Setting(
                    SettingKeyEnum.LOG_RETENTION_DURATION,
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
                expect(getSpy).toHaveBeenNthCalledWith(1, SettingKeyEnum.INSTRUCTIONS_OVERLAY)
                expect(getSpy).toHaveBeenNthCalledWith(2, SettingKeyEnum.ADVANCED_MODE)
                expect(getSpy).toHaveBeenNthCalledWith(3, SettingKeyEnum.CONSOLE_LOGS)
                expect(getSpy).toHaveBeenNthCalledWith(4, SettingKeyEnum.INFO_MESSAGES)
                expect(getSpy).toHaveBeenNthCalledWith(5, SettingKeyEnum.LOG_RETENTION_DURATION)
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
                    key: SettingKeyEnum.CONSOLE_LOGS,
                    value: true,
                }
                getSpy.mockResolvedValue(setting)
                const res = await DB.getSetting(setting.key)
                expect(getSpy).toBeCalledWith('console-logs')
                expect(res).toBe(setting)
            })

            it('should return undefined if no setting exists', async () => {
                getSpy.mockResolvedValue(undefined)
                const res = await DB.getSetting(SettingKeyEnum.CONSOLE_LOGS)
                expect(getSpy).toBeCalledWith('console-logs')
                expect(res).toBe(undefined)
            })
        })

        describe('purgeLogs()', () => {
            it('should purge logs that are beyond the retention duration', async () => {
                const logRetentionDurationSetting = new Setting(
                    SettingKeyEnum.LOG_RETENTION_DURATION,
                    DurationEnum.Now, // Purging logs right away for the test
                )
                const log1: Log = {
                    autoId: 1,
                    createdAt: Date.now() - 10, // Force delete because this log is older
                    logLevel: LogLevelEnum.DEBUG,
                    label: 'Test DEBUG Log 1',
                    details: undefined,
                }
                const log2: Log = {
                    autoId: 2,
                    createdAt: Date.now() + 10, // Don't delete
                    logLevel: LogLevelEnum.INFO,
                    label: 'Test INFO Log 2',
                    details: undefined,
                }
                getSpy.mockResolvedValue(logRetentionDurationSetting)
                logsToArraySpy.mockResolvedValue([log1, log2])
                bulkDeleteSpy.mockResolvedValue(undefined)
                const res = await DB.purgeLogs()
                expect(getSpy).toBeCalledWith(SettingKeyEnum.LOG_RETENTION_DURATION)
                expect(logsToArraySpy).toHaveBeenCalled()
                expect(bulkDeleteSpy).toHaveBeenCalledWith([log1.autoId])
                expect(res).toBe(1)
            })
        })

        describe('addLog()', () => {
            const label = 'Test Error'
            const logLevel = LogLevelEnum.DEBUG
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
                        details: expect.objectContaining({
                            name: 'Error',
                            message: label,
                            stack: expect.any(String),
                        }),
                    }),
                )
                expect(res).toBe(1)
            })

            it('should add log with custom details if provided', async () => {
                addSpy.mockResolvedValueOnce(1)

                const res = await DB.addLog(logLevel, label, customDetails)

                expect(addSpy).toBeCalledWith(
                    expect.objectContaining({
                        createdAt: expect.any(Number),
                        logLevel,
                        label,
                        details: customDetails,
                    }),
                )
                expect(res).toBe(1)
            })
        })

        // describe('liveSettings()', () => {
        //     it('should return a live query of all settings', async () => {
        //         const settings = [
        //             new Setting(SettingKeyEnum.INSTRUCTIONS_OVERLAY, true),
        //             new Setting(SettingKeyEnum.ADVANCED_MODE, false),
        //             new Setting(SettingKeyEnum.CONSOLE_LOGS, false),
        //             new Setting(SettingKeyEnum.INFO_MESSAGES, true),
        //             new Setting(
        //                 SettingKeyEnum.LOG_RETENTION_DURATION,
        //                 DurationEnum['Six Months'],
        //             ),
        //         ]
        //         toArraySpy.mockResolvedValue(settings)
        //         const res = await DB.liveSettings()
        //         expect(toArraySpy).toHaveBeenCalled()
        //         expect(res).toEqual(settings)
        //     })
        // })

        // describe('importData()', () => {
        //     // TODO
        //     it.skip('should ...', async () => {})
        // })

        describe('getBackupData()', () => {
            it('should return all data from the DB for the backup', async () => {
                settingsToArraySpy.mockResolvedValueOnce([1])
                logsToArraySpy.mockResolvedValueOnce([2])
                exampleConfigsToArraySpy.mockResolvedValueOnce([3])
                exampleResultsToArraySpy.mockResolvedValueOnce([4])

                const res = await DB.getBackupData()

                expect(settingsToArraySpy).toBeCalledTimes(1)
                expect(logsToArraySpy).toBeCalledTimes(1)
                expect(exampleConfigsToArraySpy).toBeCalledTimes(1)
                expect(exampleResultsToArraySpy).toBeCalledTimes(1)
                expect(res).toEqual({
                    appName: appName,
                    databaseVersion: appDatabaseVersion,
                    createdAt: expect.any(Number),
                    [DBTableEnum.SETTINGS]: [1],
                    [DBTableEnum.LOGS]: [2],
                    [DBTableEnum.EXAMPLE_CONFIGS]: [3],
                    [DBTableEnum.EXAMPLE_RESULTS]: [4],
                })
            })
        })

        describe('clearAppData()', () => {
            it('should clear each table and re-init the settings', async () => {
                settingsClearSpy.mockResolvedValueOnce(undefined)
                logsClearSpy.mockResolvedValueOnce(undefined)
                exampleConfigsClearSpy.mockResolvedValueOnce(undefined)
                exampleResultsClearSpy.mockResolvedValueOnce(undefined)

                const res = await DB.clearAppData()

                expect(settingsClearSpy).toBeCalledTimes(1)
                expect(logsClearSpy).toBeCalledTimes(1)
                expect(exampleConfigsClearSpy).toBeCalledTimes(1)
                expect(exampleResultsClearSpy).toBeCalledTimes(1)
                // Expecting the default settings to be re-initialized in this test
                expect(res).toEqual([
                    {
                        key: SettingKeyEnum.INSTRUCTIONS_OVERLAY,
                        value: true,
                    },
                    {
                        key: SettingKeyEnum.ADVANCED_MODE,
                        value: false,
                    },
                    {
                        key: SettingKeyEnum.CONSOLE_LOGS,
                        value: false,
                    },
                    {
                        key: SettingKeyEnum.INFO_MESSAGES,
                        value: true,
                    },
                    {
                        key: SettingKeyEnum.LOG_RETENTION_DURATION,
                        value: DurationEnum[DurationEnum['Six Months']],
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
