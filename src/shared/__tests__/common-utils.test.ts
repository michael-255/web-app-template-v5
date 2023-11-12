import { getCompactDateFromMs, getDurationFromMs, truncateString } from '@/shared/common-utils'
import { expect, it } from 'vitest'

it('truncateString', () => {
    const str = 'Test string with 31 characters!'
    expect(truncateString(str, 10, '...')).toBe('Test strin...')
    expect(truncateString(str, 15, '*')).toBe('Test string wit*')
    expect(truncateString(null, 1, '...')).toBe('')
    expect(truncateString(undefined, 1, '*')).toBe('')
})

it('getCompactDateFromMs', () => {
    const quasarDateRegex = /^[A-Za-z]{3}, \d{4} [A-Za-z]{3} \d{1,2}(st|nd|rd|th), \d{1,2}:\d{2} (AM|PM)$/
    expect(getCompactDateFromMs(1609596950000)).toMatch(quasarDateRegex)
})

it('getDurationFromMs', () => {
    expect(getDurationFromMs(0)).toBe('')
    expect(getDurationFromMs(1000)).toBe('1s')
    expect(getDurationFromMs(60000)).toBe('1m ')
    expect(getDurationFromMs(3600000)).toBe('1h ')
    expect(getDurationFromMs(86400000)).toBe('1d ')
    expect(getDurationFromMs(90061000)).toBe('1d 1h 1m 1s')
    expect(getDurationFromMs(undefined)).toBe('')
    expect(getDurationFromMs(null)).toBe('')
})
