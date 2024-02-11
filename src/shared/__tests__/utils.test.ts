import { compactDateFromMs, durationFromMs, truncateText } from '@/shared/utils'
import { expect, it } from 'vitest'

it('truncateText', () => {
    const str = 'Test string with 31 characters!'
    expect(truncateText(str, 10, '...')).toBe('Test strin...')
    expect(truncateText(str, 15, '*')).toBe('Test string wit*')
    expect(truncateText(null, 1, '...')).toBe('')
    expect(truncateText(undefined, 1, '*')).toBe('')
})

it('compactDateFromMs', () => {
    const quasarDateRegex =
        /^[A-Za-z]{3}, \d{4} [A-Za-z]{3} \d{1,2}(st|nd|rd|th), \d{1,2}:\d{2} (AM|PM)$/
    expect(compactDateFromMs(1609596950000)).toMatch(quasarDateRegex)
})

it('durationFromMs', () => {
    expect(durationFromMs(0)).toBe('')
    expect(durationFromMs(1000)).toBe('1s')
    expect(durationFromMs(60000)).toBe('1m ')
    expect(durationFromMs(3600000)).toBe('1h ')
    expect(durationFromMs(86400000)).toBe('1d ')
    expect(durationFromMs(90061000)).toBe('1d 1h 1m 1s')
    expect(durationFromMs(undefined)).toBe('')
    expect(durationFromMs(null)).toBe('')
})
