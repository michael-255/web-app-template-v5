import type { QTableColumn } from 'quasar'

/**
 * Returns formatted count string with the number of elements found in the provided array.
 * @returns `42 records found`
 */
export function getRecordCountDisplay(records: any[]) {
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
 * Returns a QTableColumn that will be hidden in the UI. Use this when you want the first ID column
 * to be hidden, but still accessible in the QTable row props. You must include the name of the
 * property you are hiding (normally `id` or `autoId`).
 * @returns `QTableColumn`
 */
export function hiddenColumn(propertyName: string): QTableColumn {
    return {
        name: 'hidden', // Needed in QTable row props
        label: '',
        align: 'left',
        sortable: false,
        required: true,
        field: (row: any) => row[propertyName],
        format: (val: string) => `${val}`,
        style: 'display: none', // Hide column in QTable
    }
}

/**
 * Only table columns that are required will not be togglable in the UI (like `hidden` columns).
 * @returns `string[]`
 */
export function getColumnOptions(tableColumns: QTableColumn[]) {
    return tableColumns.filter((col) => !col.required)
}

/**
 * What column options are visiable on the data table. Based on previous column options.
 * @returns `string[]`
 */
export function getVisibleColumns(tableColumns: QTableColumn[]) {
    const columnOptions = getColumnOptions(tableColumns).filter((col) => !col.required)
    return columnOptions.map((col) => col.name)
}
