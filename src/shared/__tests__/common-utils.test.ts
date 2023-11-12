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
    expect(getCompactDateFromMs(1609596000000)).toBe('Sat, 2021 Jan 2nd, 9:00 AM')
    expect(getCompactDateFromMs(1699939200000)).toBe('Tue, 2023 Nov 14th, 12:20 AM')
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
