import DB from '@/services/Database'
import { Constant, Enum, Icon, Type } from '@/shared'
import { useNotifications } from '@/use/useNotifications'
import { colors } from 'quasar'

export function useLogger() {
    const { getPaletteColor } = colors
    const { notify } = useNotifications()
    const loggerName = `%c${Constant.AppName}`
    const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
    const style = {
        print: `${baseStyle} ${getPaletteColor('secondary')};`,
        debug: `${baseStyle} ${getPaletteColor('accent')};`,
        info: `${baseStyle} ${getPaletteColor('info')};`,
        warn: `${baseStyle} ${getPaletteColor('warning')};`,
        error: `${baseStyle} ${getPaletteColor('negative')};`,
    }

    const log = {
        print: (message: any, ...args: any) => {
            console.log(loggerName, style.print, message, ...args)
        },

        silentDebug: async (name: string, details?: Type.LogExtraDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
            }
        },

        debug: async (name: string, details?: Type.LogExtraDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
                notify(name, Icon.debug, 'accent')
            }
        },

        info: async (name: string, details?: Type.LogExtraDetails) => {
            if (await DB.getSettingValue(Enum.SettingKey.CONSOLE_LOGS)) {
                console.log(loggerName, style.info, `[${Enum.LogLevel.INFO}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.INFO, name, details)
            if (await DB.getSettingValue(Enum.SettingKey.INFO_MESSAGES)) {
                notify(name, Icon.info, 'info')
            }
        },

        warn: async (name: string, details?: Type.LogExtraDetails) => {
            if (await DB.getSettingValue(Enum.SettingKey.CONSOLE_LOGS)) {
                console.warn(loggerName, style.warn, `[${Enum.LogLevel.WARN}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.WARN, name, details)
            notify(name, Icon.warn, 'warning')
        },

        error: async (name: string, details?: Type.LogExtraDetails) => {
            if (await DB.getSettingValue(Enum.SettingKey.CONSOLE_LOGS)) {
                console.error(loggerName, style.error, `[${Enum.LogLevel.ERROR}]`, name, details)
            }
            await DB.addLog(Enum.LogLevel.ERROR, name, details)
            notify(name, Icon.error, 'negative')
        },
    }

    return { log }
}
