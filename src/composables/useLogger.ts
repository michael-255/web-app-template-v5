import Log from '@/models/Log'
import DB from '@/services/db'
import logService from '@/services/LogService'
import settingService from '@/services/SettingService'
import { appName } from '@/shared/constants'
import { LogLevelEnum, SettingIdEnum } from '@/shared/enums'
import { debugIcon, errorIcon, infoIcon, warnIcon } from '@/shared/icons'
import type { LogDetailsType } from '@/shared/types'
import { colors, useQuasar } from 'quasar'

export default function useLogger() {
    const notify = useQuasar().notify
    const loggerName = `%c${appName}`
    const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
    const style = {
        print: `${baseStyle} ${colors.getPaletteColor('secondary')};`,
        debug: `${baseStyle} ${colors.getPaletteColor('accent')};`,
        info: `${baseStyle} ${colors.getPaletteColor('info')};`,
        warn: `${baseStyle} ${colors.getPaletteColor('warning')};`,
        error: `${baseStyle} ${colors.getPaletteColor('negative')};`,
    }

    const log = {
        print: (message: any, ...args: any) => {
            console.log(loggerName, style.print, message, ...args)
        },

        silentDebug: (name: string, details?: LogDetailsType) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${LogLevelEnum.DEBUG}]`, name, details)
            }
        },

        debug: (name: string, details?: LogDetailsType) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${LogLevelEnum.DEBUG}]`, name, details)
                notify({ message: name, icon: debugIcon, color: 'accent' })
            }
        },

        info: async (name: string, details?: LogDetailsType) => {
            if ((await settingService.get(DB, SettingIdEnum.CONSOLE_LOGS))?.value) {
                console.log(loggerName, style.info, `[${LogLevelEnum.INFO}]`, name, details)
            }
            const logModel = new Log({
                logLevel: LogLevelEnum.INFO,
                label: name,
                details,
            })
            await logService.add(DB, logModel)
            if ((await settingService.get(DB, SettingIdEnum.INFO_MESSAGES))?.value) {
                notify({ message: name, icon: infoIcon, color: 'info' })
            }
        },

        warn: async (name: string, details?: LogDetailsType) => {
            if ((await settingService.get(DB, SettingIdEnum.CONSOLE_LOGS))?.value) {
                console.warn(loggerName, style.warn, `[${LogLevelEnum.WARN}]`, name, details)
            }
            const logModel = new Log({
                logLevel: LogLevelEnum.WARN,
                label: name,
                details,
            })
            await logService.add(DB, logModel)
            notify({ message: name, icon: warnIcon, color: 'warning' })
        },

        error: async (name: string, details?: LogDetailsType) => {
            if ((await settingService.get(DB, SettingIdEnum.CONSOLE_LOGS))?.value) {
                console.error(loggerName, style.error, `[${LogLevelEnum.ERROR}]`, name, details)
            }
            const logModel = new Log({
                logLevel: LogLevelEnum.ERROR,
                label: name,
                details,
            })
            await logService.add(DB, logModel)
            notify({ message: name, icon: errorIcon, color: 'negative' })
        },
    }

    return { log }
}
