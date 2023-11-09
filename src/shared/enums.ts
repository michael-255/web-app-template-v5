export enum Limit {
    MAX_FILE_SIZE = 1_000_000,
    MAX_TEXT_AREA = 250,
    MAX_NAME = 50,
    MIN_NAME = 1,
}

export enum DBTable {
    SETTINGS = 'settings',
    LOGS = 'logs',
    EXAMPLES = 'examples',
}

export enum SettingKey {
    INSTRUCTIONS_OVERLAY = 'instructions-overlay',
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
