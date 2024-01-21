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
