/**
 * Route names used by the router for page selection.
 */
export enum RouteNameEnum {
    MENU_LAYOUT = 'MenuLayout',
    DASHBOARD = 'Dashboard',
    TABLE = 'Table',
    SETTINGS = 'Settings',
    ABOUT = 'About',
    DONATE = 'Donate',
    NOT_FOUND = 'NotFound',
}

/**
 * Slug strings for database tables used by the router in URLs.
 */
export enum RouteTableEnum {
    SETTINGS = 'settings',
    LOGS = 'logs',
    EXAMPLES = 'examples',
    EXAMPLE_RESULTS = 'example-results',
}

/**
 * Shortened string representations of database tables. Used as prefixes for Ids. This helps with
 * database operations and debugging.
 */
export enum TableEnum {
    SETTINGS = 'set', // Standalone
    LOGS = 'log', // Standalone
    EXAMPLES = 'exp', // Parent
    EXAMPLE_RESULTS = 'exr', // Child
}

export enum GroupEnum {
    STANDALONE = 'Standalone',
    PARENT = 'Parent',
    CHILD = 'Child',
}

export enum SettingIdEnum {
    ADVANCED_MODE = 'set-advanced-mode',
    INSTRUCTIONS_OVERLAY = 'set-instructions-overlay',
    CONSOLE_LOGS = 'set-console-logs',
    INFO_MESSAGES = 'set-info-messages',
    LOG_RETENTION_DURATION = 'set-log-retention-duration',
}

export enum LogLevelEnum {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export enum TagEnum {
    LOCKED = 'Locked', // All
    ENABLED = 'Enabled', // Parent
    FAVORITED = 'Favorited', // Parent
    SKIPPED = 'Skipped', // Child
}

export enum LimitEnum {
    MAX_ID = 30,
    MAX_FILE_SIZE = 1_000_000,
    MAX_TEXT_AREA = 250,
    MAX_NAME = 50,
    MIN_NAME = 1,
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
