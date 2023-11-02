// import useNotifications from '@/composables/useNotifications'
// import { LogLevel } from '@/models/Log'
// import { SettingKey } from '@/models/Setting'
// import DB from '@/services/Database'
// import { Icon } from '@/types/general'

// export default function useLogger() {
//     const { notify } = useNotifications()
//     const loggerName = `%c__AppName__`
//     const baseStyle = 'border-radius: 3px; padding: 2px 4px; color: white; background-color:'
//     const style = {
//         // TODO Pull these colors from the brand palette somehow?
//         print: `${baseStyle} #607d8b;`,
//         debug: `${baseStyle} #673ab7;`,
//         info: `${baseStyle} #0d47a1;`,
//         warn: `${baseStyle} #ff6f00;`,
//         error: `${baseStyle} #C10015;`,
//     }

//     const log = {
//         print: (message: any, ...args: any) => {
//             // TODO Test using `...args` with a default empty string maybe?
//             console.log(loggerName, style.print, message, ...args)
//         },

//         silentDebug: async (name: string, details?: any) => {
//             if (import.meta.env.DEV) {
//                 console.log(loggerName, style.debug, `[${LogLevel.DEBUG}]`, name, details)
//             }
//         },

//         debug: async (name: string, details?: any) => {
//             if (import.meta.env.DEV) {
//                 console.log(loggerName, style.debug, `[${LogLevel.DEBUG}]`, name, details)
//                 notify(name, Icon.DEBUG, 'accent')
//             }
//         },

//         info: async (name: string, details?: any) => {
//             if ((await DB.getSetting(SettingKey.CONSOLE_LOGS))?.value) {
//                 console.log(loggerName, style.info, `[${LogLevel.INFO}]`, name, details)
//             }

//             await DB.addLog(LogLevel.INFO, name, details)

//             if ((await DB.getSetting(SettingKey.INFO_MESSAGES))?.value) {
//                 notify(name, Icon.INFO, 'info')
//             }
//         },

//         warn: async (name: string, details?: any) => {
//             if ((await DB.getSetting(SettingKey.CONSOLE_LOGS))?.value) {
//                 console.warn(loggerName, style.warn, `[${LogLevel.WARN}]`, name, details)
//             }

//             await DB.addLog(LogLevel.WARN, name, details)
//             notify(name, Icon.WARN, 'warning')
//         },

//         error: async (name: string, details?: any) => {
//             if ((await DB.getSetting(SettingKey.CONSOLE_LOGS))?.value) {
//                 console.error(loggerName, style.error, `[${LogLevel.ERROR}]`, name, details)
//             }

//             await DB.addLog(LogLevel.ERROR, name, details)
//             notify(name, Icon.ERROR, 'negative')
//         },
//     }

//     return { log }
// }
