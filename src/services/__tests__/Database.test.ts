import { Example, Log, Setting } from '@/models'
import { Enum } from '@/shared'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { DatabaseApi, DatabaseTables } from '../Database'

const getSpy = vi.fn()
const addSpy = vi.fn()

const databaseTablesMock = {
    settings: {
        get: getSpy,
    },
    logs: {
        add: addSpy,
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
                        extraDetails: undefined,
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
                        extraDetails: undefined,
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
                        extraDetails: customDetails,
                        errorMessage: undefined,
                        stackTrace: undefined,
                    }),
                )
                expect(res).toBe(1)
            })
        })
    })
})
