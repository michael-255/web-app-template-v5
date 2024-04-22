import { DurationMSEnum } from '@/shared/enums'
import { date } from 'quasar'

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
