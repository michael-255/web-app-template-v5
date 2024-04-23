import { GroupEnum, TableEnum } from '@/shared/enums'
import {
    exampleResultSchema,
    exampleSchema,
    logSchema,
    settingSchema,
    tableSchema,
} from '@/shared/schemas'
import type { DBRecordType, IdType } from '@/shared/types'
import { uid } from 'quasar'

/**
 * Creates an Id with the table encoded in the prefix. Encoding this extra information helps with
 * database operations and debugging.
 * @param table TableEnum
 * @returns Ex: `log-763f1fb0-1a4d-4327-b83c-be7565ec3f83`
 */
export function createId(table: TableEnum) {
    if (!table) {
        throw new Error(`Invalid Table: ${table}`)
    }
    return `${table}-${uid()}` as IdType
}

/**
 * Determines which table an Id belongs to and returns it.
 * @param id IdType
 * @returns TableEnum
 */
export function extractTableFromId(id: IdType) {
    const table = id.substring(0, 3) as TableEnum
    return tableSchema.parse(table)
}

/**
 * Determines which group a table belongs to and returns it.
 * @param table TableEnum
 * @returns GroupEnum
 */
export function getTableGroup(table: TableEnum) {
    switch (table) {
        case TableEnum.SETTINGS:
        case TableEnum.LOGS:
            return GroupEnum.STANDALONE
        case TableEnum.EXAMPLES:
            return GroupEnum.PARENT
        case TableEnum.EXAMPLE_RESULTS:
            return GroupEnum.CHILD
        default:
            throw new Error(`Invalid Table: ${table}`)
    }
}

/**
 * Returns the label for a table in singular or plural form.
 * @param table TableEnum
 * @param style singular or plural
 * @returns Ex: `Logs`
 */
export function getTableLabel(table: TableEnum, style: 'singular' | 'plural' = 'singular') {
    switch (table) {
        case TableEnum.SETTINGS:
            return style === 'singular' ? 'Setting' : 'Settings'
        case TableEnum.LOGS:
            return style === 'singular' ? 'Log' : 'Logs'
        case TableEnum.EXAMPLES:
            return style === 'singular' ? 'Example' : 'Examples'
        case TableEnum.EXAMPLE_RESULTS:
            return style === 'singular' ? 'Example Result' : 'Example Results'
        default:
            throw new Error(`Invalid Table: ${table}`)
    }
}

/**
 * Returns the parent table for a given child table or an error.
 * @param table TableEnum
 * @returns Parent TableEnum
 */
export function getParentTable(table: TableEnum) {
    switch (table) {
        case TableEnum.EXAMPLE_RESULTS:
            return TableEnum.EXAMPLES
        default:
            throw new Error(`Invalid Table: ${table}`)
    }
}

/**
 * Returns the child table for a given parent table or an error.
 * @param table TableEnum
 * @returns Child TableEnum
 */
export function getChildTable(table: TableEnum) {
    switch (table) {
        case TableEnum.EXAMPLES:
            return TableEnum.EXAMPLE_RESULTS
        default:
            throw new Error(`Invalid Table: ${table}`)
    }
}

/**
 * Schema parses model so all fields are validated and extra fields are removed.
 * @param model DBRecordType
 * @returns Schema parsed DBRecordType
 */
export function modelSchemaParse(model: DBRecordType): DBRecordType {
    const table = extractTableFromId(model.id)
    switch (table) {
        case TableEnum.SETTINGS:
            return settingSchema.parse(model)
        case TableEnum.LOGS:
            return logSchema.parse(model)
        case TableEnum.EXAMPLES:
            return exampleSchema.parse(model)
        case TableEnum.EXAMPLE_RESULTS:
            return exampleResultSchema.parse(model)
        default:
            throw new Error(`Unable to parse model: ${model.id}`)
    }
}
