/**
 * Enumerations used throughout the application. Defining them in one file to reduce the likelyhood
 * of circular dependencies.
 */

//
// Shared
//

/**
 * Route names used by the router for page selection.
 */
export enum RouteNameEnum {
    MENU_LAYOUT = 'MenuLayout',
    EXAMPLES_DASHBOARD = 'ExamplesDashboard',
    TABLE = 'Table',
    SETTINGS = 'Settings',
    ABOUT = 'About',
    DONATE = 'Donate',
    NOT_FOUND = 'NotFound',
}

/**
 * URL slug safe string representations of database table names.
 */
export enum TableEnum {
    SETTINGS = 'settings', // Standalone
    LOGS = 'logs', // Standalone
    EXAMPLES = 'examples', // Parent
    EXAMPLE_RESULTS = 'example-results', // Child
}

/**
 * Status indicators used to modify how the app treats a record with it.
 */
export enum StatusEnum {
    LOCKED = 'Locked', // Shared - No user interaction allowed
    HIDDEN = 'Hidden', // Parent
    FAVORITED = 'Favorited', // Parent
}

export enum LimitEnum {
    MAX_TEXT_AREA = 300,
    MAX_TEXT_LINE = 50,
}

export enum DurationEnum {
    Now = 'Now',
    'One Second' = 'One Second',
    'One Minute' = 'One Minute',
    'One Hour' = 'One Hour',
    'One Day' = 'One Day',
    'One Week' = 'One Week',
    'One Month' = 'One Month',
    'Three Months' = 'Three Months',
    'Six Months' = 'Six Months',
    'One Year' = 'One Year',
    'Two Years' = 'Two Years',
    'Three Years' = 'Three Years',
    'All Time' = 'All Time',
    'Forever' = 'Forever',
}

export enum DurationMSEnum {
    Now = 1,
    'One Second' = 1_000,
    'One Minute' = 60_000,
    'One Hour' = 3_600_000,
    'One Day' = 86_400_000,
    'One Week' = 604_800_000,
    'One Month' = 2_592_000_000,
    'Three Months' = 7_776_000_000,
    'Six Months' = 15_552_000_000,
    'One Year' = 31_536_000_000,
    'Two Years' = 63_072_000_000,
    'Three Years' = 94_608_000_000,
    'All Time' = Number.MAX_SAFE_INTEGER - 1, // So it doesn't match 'Forever'
    'Forever' = Number.MAX_SAFE_INTEGER,
}

//
// Settings
//

/**
 * The only valid IDs for settings in the application.
 */
export enum SettingIdEnum {
    ADVANCED_MODE = 'Advanced Mode',
    INSTRUCTIONS_OVERLAY = 'Instructions Overlay',
    CONSOLE_LOGS = 'Console Logs',
    INFO_MESSAGES = 'Info Messages',
    LOG_RETENTION_DURATION = 'Log Rentention Duration',
}

//
// Logs
//

export enum LogLevelEnum {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}
