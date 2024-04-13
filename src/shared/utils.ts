import Example from '@/models/Example'
import ExampleResult from '@/models/ExampleResult'
import Log from '@/models/Log'
import Setting from '@/models/Setting'
import { DBTableEnum, DurationMSEnum } from '@/shared/enums'
import { exampleResultSchema, exampleSchema, logSchema, settingSchema } from '@/shared/schemas'
import { date, type QTableColumn } from 'quasar'

/**
 * Get the string label for a table enum. Use `style` to get the singular or plural version.
 * @param table DBTableEnum
 * @param style singular or plural
 * @returns Table label string
 */
export function getTableLabel(table?: DBTableEnum, style: 'singular' | 'plural' = 'singular') {
    switch (table) {
        case DBTableEnum.SETTINGS:
            return style === 'singular' ? 'Setting' : 'Settings'
        case DBTableEnum.LOGS:
            return style === 'singular' ? 'Log' : 'Logs'
        case DBTableEnum.EXAMPLES:
            return style === 'singular' ? 'Example' : 'Examples'
        case DBTableEnum.EXAMPLE_RESULTS:
            return style === 'singular' ? 'Example Result' : 'Example Results'
        default:
            return 'Unknown'
    }
}

/**
 * Validates that the properties of a model are correct and returns an object. If `success` is
 * `true`, the `data` property will contain the validated model. If `success` is `false`, the
 * `error` property will contain the error message.
 * @param model One of the App's supported class models
 * @returns `SafeParseReturnType`
 */
export function schemaValidateModel<T extends Setting | Log | Example | ExampleResult>(model: T) {
    if (model instanceof Setting) {
        return settingSchema.safeParse(model)
    } else if (model instanceof Log) {
        return logSchema.safeParse(model)
    } else if (model instanceof Example) {
        return exampleSchema.safeParse(model)
    } else if (model instanceof ExampleResult) {
        return exampleResultSchema.safeParse(model)
    } else {
        throw new Error('Cannot validate unknown model type')
    }
}

/**
 * Parses a model into a new object with the correct properties. This is useful for creating a new
 * object from a form or other input. If the model is not one of the supported classes, an error
 * will be thrown.
 * @param model One of the App's supported class models
 * @returns `ParsedType`
 */
export function schemaParseModel<T extends Setting | Log | Example | ExampleResult>(model: T) {
    if (model instanceof Setting) {
        return settingSchema.parse(model)
    } else if (model instanceof Log) {
        return logSchema.parse(model)
    } else if (model instanceof Example) {
        return exampleSchema.parse(model)
    } else if (model instanceof ExampleResult) {
        return exampleResultSchema.parse(model)
    } else {
        throw new Error('Cannot parse unknown model type')
    }
}

/**
 * Create a hidden `QTableColumn`. Use this to hide a column that may be needed for `QTable` row
 * props, but should not be visible in the UI (normally `id`).
 * @param rowPropertyName Name of the property on the record for this column
 * @returns `QTableColumn`
 */
export function hiddenTableColumn(rowPropertyName: string): QTableColumn {
    return {
        name: 'hidden', // Needed in QTable row props
        label: '',
        align: 'left',
        sortable: false,
        required: true,
        field: (row: Record<string, string>) => row[rowPropertyName],
        format: (val: string) => `${val}`,
        style: 'display: none', // Hide column in QTable
    }
}

/**
 * Create a standard `QTableColumn`.
 * @param rowPropertyName Name of the property on the record for this column
 * @param label Display label for the property on this column
 * @param format How the property data should be formatted for display
 * @returns `QTableColumn`
 */
export function tableColumn(
    rowPropertyName: string,
    label: string,
    format:
        | 'UUID'
        | 'TEXT'
        | 'BOOL'
        | 'JSON'
        | 'DATE'
        | 'LIST-COUNT'
        | 'LIST-PRINT'
        | 'DEFAULT' = 'DEFAULT',
): QTableColumn {
    const tableColumn: QTableColumn = {
        name: rowPropertyName,
        label: label,
        align: 'left',
        sortable: true,
        required: false,
        field: (row: Record<string, string>) => row[rowPropertyName],
        format: (val: string) => `${val}`, // Default converts everythign to a string
    }

    switch (format) {
        case 'UUID':
            // Truncates so it won't overflow the table cell
            tableColumn.format = (val: string) => truncateText(val, 8, '*')
            return tableColumn
        case 'TEXT':
            // Truncates so it won't overflow the table cell
            tableColumn.format = (val: string) => truncateText(val, 40, '...')
            return tableColumn
        case 'BOOL':
            // Converts output to a Yes or No string
            tableColumn.format = (val: boolean) => (val ? 'Yes' : 'No')
            return tableColumn
        case 'JSON':
            // Converts to JSON and truncates so it won't overflow the table cell
            tableColumn.format = (val: Record<string, string>) =>
                truncateText(JSON.stringify(val), 40, '...')
            return tableColumn
        case 'DATE':
            // Converts to a compact date string
            tableColumn.format = (val: number) => compactDateFromMs(val)
            return tableColumn
        case 'LIST-COUNT':
            // Converts list to a count of the items
            tableColumn.format = (val: any[]) => `${val?.length ? val.length : 0}`
            return tableColumn
        case 'LIST-PRINT':
            // Prints the list as a truncated string
            tableColumn.format = (val: any[]) => truncateText(val.join(', '), 40, '...')
            return tableColumn
        case 'DEFAULT': // Fall through as default
        default:
            return tableColumn
    }
}

/**
 * Column options from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `QTableColumn[]`
 */
export function columnOptionsFromTableColumns(tableColumns: QTableColumn[]) {
    return tableColumns.filter((col) => !col.required)
}

/**
 * Visible columns from a `QTableColumn` array for your `QTable`.
 * @param tableColumns Your `QTableColumn` array
 * @returns `string[]`
 */
export function visibleColumnsFromTableColumns(tableColumns: QTableColumn[]) {
    const columnOptions = columnOptionsFromTableColumns(tableColumns).filter((col) => !col.required)
    return columnOptions.map((col) => col.name)
}

/**
 * Display string for the number of records found in an array.
 * @param records Array of any records from the DB
 * @returns `999 records found`
 */
export function recordCountDisplay(records: any[]) {
    const count = records?.length ?? 0

    if (count === 0) {
        return 'No records found'
    } else if (count === 1) {
        return '1 record found'
    } else {
        return `${count} records found`
    }
}

/**
 * Returns a truncated string with a custom ending if it exceeds the max length.
 * @param str Original string to be truncated
 * @param maxLength How much of the original string to keep
 * @param ending Any valid string like `...` or `*` make good endings
 * @returns
 */
export function truncateText(text: string | null | undefined, maxLength: number, ending: string) {
    return text && text.length > maxLength ? text.slice(0, maxLength) + ending : text || ''
}

/**
 * Compact readable date string from milliseconds or an empty string if your value is invalid.
 * @param milliseconds Number of milliseconds
 * @returns `Sat, 2021 Jan 2nd, 12:00 PM`
 */
export function compactDateFromMs(milliseconds: number | null | undefined) {
    if (!milliseconds || typeof milliseconds !== 'number') {
        return ''
    }
    return date.formatDate(milliseconds, 'ddd, YYYY MMM Do, h:mm A')
}

/**
 * Readable time duration string from milliseconds or an empty string if your value is below one
 * second or invalid.
 * @param milliseconds Number of milliseconds
 * @returns `9d 9h 9m 9s`
 */
export function durationFromMs(milliseconds: number | null | undefined): string | null | undefined {
    if (!milliseconds || typeof milliseconds !== 'number' || milliseconds < 1000) {
        return ''
    }

    const seconds = Math.floor((milliseconds / DurationMSEnum['One Second']) % 60)
    const minutes = Math.floor((milliseconds / DurationMSEnum['One Minute']) % 60)
    const hours = Math.floor((milliseconds / DurationMSEnum['One Hour']) % 24)
    const days = Math.floor(milliseconds / DurationMSEnum['One Day'])

    const daysStr = days > 0 ? `${days}d ` : ''
    const hoursStr = hours > 0 ? `${hours}h ` : ''
    const minutesStr = minutes > 0 ? `${minutes}m ` : ''
    const secondsStr = seconds > 0 ? `${seconds}s` : ''

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`
}
