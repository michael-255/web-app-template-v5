import DB from '@/services/Database'
import { Constant, Enum, Schema } from '@/shared'
import useNotifications from '@/use/useNotifications'

export default function useLogger() {
    const { notify } = useNotifications()
    const loggerName = `%c${Constant.AppName}`
    const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
    const style = {
        // TODO Pull these colors from the brand palette somehow?
        print: `${baseStyle} #607d8b;`,
        debug: `${baseStyle} #673ab7;`,
        info: `${baseStyle} #0d47a1;`,
        warn: `${baseStyle} #ff6f00;`,
        error: `${baseStyle} #C10015;`,
    }

    const log = {
        print: (message: any, ...args: any) => {
            // TODO Test using `...args` with a default empty string maybe?
            console.log(loggerName, style.print, message, ...args)
        },

        silentDebug: async (name: string, details?: Schema.LogExtraDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
            }
        },

        debug: async (name: string, details?: Schema.LogExtraDetails) => {
            if (import.meta.env.DEV) {
                console.log(loggerName, style.debug, `[${Enum.LogLevel.DEBUG}]`, name, details)
                notify(name, Enum.Icon.DEBUG, 'accent')
            }
        },

        info: async (name: string, details?: Schema.LogExtraDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.log(loggerName, style.info, `[${Enum.LogLevel.INFO}]`, name, details)
            }

            await DB.addLog(Enum.LogLevel.INFO, name, details)

            if ((await DB.getSetting(Enum.SettingKey.INFO_MESSAGES))?.value) {
                notify(name, Enum.Icon.INFO, 'info')
            }
        },

        warn: async (name: string, details?: Schema.LogExtraDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.warn(loggerName, style.warn, `[${Enum.LogLevel.WARN}]`, name, details)
            }

            await DB.addLog(Enum.LogLevel.WARN, name, details)
            notify(name, Enum.Icon.WARN, 'warning')
        },

        error: async (name: string, details?: Schema.LogExtraDetails) => {
            if ((await DB.getSetting(Enum.SettingKey.CONSOLE_LOGS))?.value) {
                console.error(loggerName, style.error, `[${Enum.LogLevel.ERROR}]`, name, details)
            }

            await DB.addLog(Enum.LogLevel.ERROR, name, details)
            notify(name, Enum.Icon.ERROR, 'negative')
        },
    }

    return { log }
}
