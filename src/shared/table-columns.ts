import type { QTableColumn } from 'quasar'
import { getCompactDateFromMs, truncateString } from './common-utils'
import { LogLevel } from './enums'

//
// Shared
//

export const hiddenIdColumn: QTableColumn = {
    name: 'hiddenId', // Needed in QTable row props
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
    format: (val: string) => truncateString(val, 8, '*'), // TODO - Make util specifically for this
} as const

export const createdAtColumn: QTableColumn = {
    name: 'createdAt',
    label: 'Created Date',
    align: 'left',
    sortable: true,
    required: false,
    field: (row: any) => row.createdAt,
    format: (val: number) => getCompactDateFromMs(val), // TODO - Make util specifically for this
} as const

//
// Logs
//

export const hiddenAutoIdColumn: QTableColumn = {
    name: 'hiddenAutoId', // Needed in QTable row props
    label: '',
    align: 'left',
    sortable: false,
    required: true,
    field: (row: any) => row.autoId,
    format: (val: number) => `${val}`, // Hide column in QTable
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
    format: (val: string) => truncateString(val, 50, '...'),
} as const
