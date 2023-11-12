import DB from '@/services/Database'
import { Constant, Enum, Icon, Type } from '@/shared'
import { colors, useQuasar } from 'quasar'

export function useLogger() {
    const notify = useQuasar().notify
    const loggerName = `%c${Constant.AppName}`
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

        silentDebug: (name: string, details?: Type.LogDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
            }
        },

        debug: (name: string, details?: Type.LogDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
                // TODO - Customise notifications for each log level
                notify({ message: name, icon: Icon.debug, color: 'accent' })
            }
        },

        info: async (name: string, details?: Type.LogDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.log(loggerName, style.info, `[${Enum.LogLevel.INFO}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.INFO, name, details)
            if ((await DB.getSetting(Enum.SettingKey.INFO_MESSAGES))?.value) {
                // TODO - Customise notifications for each log level
                notify({ message: name, icon: Icon.info, color: 'info' })
            }
        },

        warn: async (name: string, details?: Type.LogDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.warn(loggerName, style.warn, `[${Enum.LogLevel.WARN}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.WARN, name, details)
            // TODO - Customise notifications for each log level
            notify({ message: name, icon: Icon.warn, color: 'warning' })
        },

        error: async (name: string, details?: Type.LogDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.error(loggerName, style.error, `[${Enum.LogLevel.ERROR}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.ERROR, name, details)
            // TODO - Customise notifications for each log level
            notify({ message: name, icon: Icon.error, color: 'negative' })
        },
    }

    return { log }
}
