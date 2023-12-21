import { Enum } from '@/shared'
import { date } from 'quasar'

/**
 * Truncates a string if it exceeds the max length.
 * @returns `Limit 14 chara...`
 */
export function truncateString(
    str: string | null | undefined,
    maxLength: number,
    ending: '...' | '*',
) {
    return str && str.length > maxLength ? str.slice(0, maxLength) + ending : str || ''
}

/**
 * Get a compact readable date string from milliseconds.
 * @returns `Sat, 2021 Jan 2nd, 12:00 PM`
 */
export function getCompactDateFromMs(milliseconds: number) {
    return date.formatDate(milliseconds, 'ddd, YYYY MMM Do, h:mm A')
}

/**
 * Get a readable time duration string from milliseconds.
 * @returns `1d 14h 6m 33s`
 */
export function getDurationFromMs(
    milliseconds: number | null | undefined,
): string | null | undefined {
    if (!milliseconds || milliseconds < 1000) {
        return ''
    }

    const seconds = Math.floor((milliseconds / Enum.DurationMS['One Second']) % 60)
    const minutes = Math.floor((milliseconds / Enum.DurationMS['One Minute']) % 60)
    const hours = Math.floor((milliseconds / Enum.DurationMS['One Hour']) % 24)
    const days = Math.floor(milliseconds / Enum.DurationMS['One Day'])

    const daysStr = days > 0 ? `${days}d ` : ''
    const hoursStr = hours > 0 ? `${hours}h ` : ''
    const minutesStr = minutes > 0 ? `${minutes}m ` : ''
    const secondsStr = seconds > 0 ? `${seconds}s` : ''

    return `${daysStr}${hoursStr}${minutesStr}${secondsStr}`
}
