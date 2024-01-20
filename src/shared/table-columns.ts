import type { QTableColumn } from 'quasar'
import { getCompactDateFromMs, truncateString } from './common-utils'
import { LogLevel } from './enums'
import type { LogDetails, SettingKey, SettingValue } from './types'

/**
 * @TODO - Decide if your going to write utils specifically for Table Columns formatting functions. This would allow you
 * to more carefully craft these functions to handle the specific data types that are being passed in and format them as
 * readable strings in the Data Table views.
 *
 * You could also make generic functions to slim down the repeated code in this file.
 *
 * @EXAMPLES
 * formatId: (val: string) => truncateString(val, 8, '*'),
 * formatCreatedAt: (val: number) => getCompactDateFromMs(val),
 * formatName: (val: string) => truncateString(val, 50, '...'),
 */

//
// Shared
//

export const hiddenIdColumn: QTableColumn = {
    name: 'hidden', // Needed in QTable row props
    label: '',
    align: 'left',
    sortable: false,
    required: true,
    field: (row: any) => row.id,
    format: (val: string) => `${val}`,
    style: 'display: none', // Hide column in QTable
} as const

export const idColumn: QTableColumn = {
    name: 'id',
    label: 'Id*',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.id,
    format: (val: string) => truncateString(val, 8, '*'),
} as const

export const createdAtColumn: QTableColumn = {
    name: 'createdAt',
    label: 'Created Date',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.createdAt,
    format: (val: number) => getCompactDateFromMs(val),
} as const

export const nameColumn: QTableColumn = {
    name: 'name',
    label: 'Name',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.name,
    format: (val: string) => truncateString(val, 50, '...'),
} as const

export const descColumn: QTableColumn = {
    name: 'desc',
    label: 'Description',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.desc,
    format: (val: string) => truncateString(val, 50, '...'),
} as const

export const tagsColumn: QTableColumn = {
    name: 'tags',
    label: 'Tags',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.tags,
    format: (val: string[]) => val.join(', '),
} as const

//
// Settings
//

export const keyColumn: QTableColumn = {
    name: 'key',
    label: 'Key',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row.key,
    format: (val: SettingKey) => `${val}`,
} as const

export const valueColumn: QTableColumn = {
    name: 'value',
    label: 'Value',
    align: 'left',
    sortable: true,
    required: true,
    field: (row: any) => row.value,
    format: (val: SettingValue) => `${val}`,
} as const

//
// Logs
//

export const hiddenAutoIdColumn: QTableColumn = {
    name: 'hidden', // Needed in QTable row props
    label: '',
    align: 'left',
    sortable: false,
    required: true,
    field: (row: any) => row.autoId,
    format: (val: number) => `${val}`,
    style: 'display: none', // Hide column in QTable
} as const

export const autoIdColumn: QTableColumn = {
    name: 'autoId',
    label: 'Auto Id',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.autoId,
    format: (val: number) => `${val}`,
} as const

export const logLevelColumn: QTableColumn = {
    name: 'logLevel',
    label: 'Log Level',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.logLevel,
    format: (val: LogLevel) => `${val}`,
} as const

export const labelColumn: QTableColumn = {
    name: 'label',
    label: 'Label',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.label,
    format: (val: string) => truncateString(val, 40, '...'),
} as const

export const detailsColumn: QTableColumn = {
    name: 'details',
    label: 'Details',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.details,
    format: (val: LogDetails) => truncateString(JSON.stringify(val), 40, '...'),
} as const

export const errorMessageColumn: QTableColumn = {
    name: 'errorMessage',
    label: 'Error Message',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.errorMessage,
    format: (val: string) => truncateString(val, 40, '...'),
} as const

export const stackTraceColumn: QTableColumn = {
    name: 'stackTrace',
    label: 'Stack Trace',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.stackTrace,
    format: (val: string) => truncateString(val, 40, '...'),
} as const

//
// Example
//

export const dataColumn: QTableColumn = {
    name: 'data',
    label: 'Example Data',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.data,
    format: (val: number[]) => val.join(', '),
} as const
