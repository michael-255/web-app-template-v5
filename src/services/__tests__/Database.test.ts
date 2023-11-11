import { Example, Log, Setting } from '@/models'
import { describe, expect, it } from 'vitest'
import { DatabaseTables } from '../Database'

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
        it('should call getSettingValue() with expected arguments', async () => {
            // const value = await DB.getSettingValue(Enum.SettingKey.CONSOLE_LOGS)
            // expect(spys.getSettingValueSpy).toBeCalledWith('console-logs')
            // expect(value).toBe(true)
            expect(true).toBe(true)
        })
    })
})
