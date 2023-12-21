export enum Limit {
    MAX_FILE_SIZE = 1_000_000,
    MAX_TEXT_AREA = 250,
    MAX_NAME = 50,
    MIN_NAME = 1,
}

export enum DBTable {
    SETTINGS = 'settings',
    LOGS = 'logs',
    EXAMPLE_CONFIGS = 'exampleConfigs',
    EXAMPLE_RESULTS = 'exampleResults',
}

export enum SettingKey {
    INSTRUCTIONS_OVERLAY = 'instructions-overlay',
    ADVANCED_MODE = 'advanced-mode',
    CONSOLE_LOGS = 'console-logs',
    INFO_MESSAGES = 'info-messages',
    LOG_RETENTION_DURATION = 'log-retention-duration',
}

export enum LogLevel {
    DEBUG = 'DEBUG',
    INFO = 'INFO',
    WARN = 'WARN',
    ERROR = 'ERROR',
}

export enum Tag {
    ACTIVATED = 'activated',
    ENABLED = 'enabled',
    FAVORITED = 'favorited',
    SKIPPED = 'skipped',
}

export enum Duration {
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

export enum DurationMS {
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

export enum RouteName {
    MENU_LAYOUT = 'MenuLayout',
    EXAMPLES = 'Examples',
    TESTS = 'Tests',
    SETTINGS = 'Settings',
    NOT_FOUND = 'NotFound',
}
