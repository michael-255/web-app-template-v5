import {
    symRoundedAssignment,
    symRoundedBugReport,
    symRoundedCancel,
    symRoundedDashboard,
    symRoundedError,
    symRoundedFitnessCenter,
    symRoundedHealthMetrics,
    symRoundedInfo,
    symRoundedKeyboardArrowUp,
    symRoundedRedeem,
    symRoundedSettings,
    symRoundedSmartToy,
    symRoundedStraighten,
    symRoundedWarning,
} from '@quasar/extras/material-symbols-rounded'

/**
 * Use `string` as the expected type for Icons.
 * @see https://fonts.google.com/icons
 * @see https://quasar.dev/vue-components/icon#import-guide
 */

// Log Levels
export const debug = symRoundedBugReport
export const info = symRoundedInfo
export const warn = symRoundedWarning
export const error = symRoundedError

// Pages
export const dashboard = symRoundedDashboard
export const donate = symRoundedRedeem
export const settings = symRoundedSettings
export const examples = symRoundedSmartToy

// Actions
export const up = symRoundedKeyboardArrowUp
export const close = symRoundedCancel

// Fitness
export const workout = symRoundedAssignment
export const exercise = symRoundedFitnessCenter
export const health = symRoundedHealthMetrics
export const measurement = symRoundedStraighten

/*
export enum Icon {
    // Log Levels
    DEBUG = 'bug_report',
    INFO = 'info',
    WARN = 'warning',
    ERROR = 'error',

    // Pages
    DONATE = 'redeem',
    DASHBOARD = 'dashboard',
    SETTINGS = 'settings',
    LOGS = 'plagiarism',
    FAQ = 'help_center',
    NOT_FOUND = 'question_mark',

    // Dialogs
    CHARTS = 'bar_chart',
    INSPECT = 'manage_search',
    NOTE = 'sticky_note_2',

    // Tables Types
    PARENTS = 'table_chart',
    CHILDREN = 'fact_check',
    WORKOUTS = 'assignment',
    EXERCISES = 'fitness_center',
    MEASUREMENTS = 'straighten',

    // Actions
    BACK = 'arrow_back',
    FAVORITE_ON = 'star',
    FAVORITE_OFF = 'star_border',
    REFRESH = 'refresh',
    CLEAR = 'delete_sweep',
    CLOSE = 'close',
    CREATE = 'add_circle',
    DELETE = 'delete',
    EDIT = 'edit',
    UP = 'keyboard_arrow_up',
    ATTACH = 'post_add',
    CANCEL = 'cancel',
    ADD = 'add',
    REMOVE = 'remove',
    SAVE = 'save',
    DEFAULTS = 'playlist_add',
    REMOVE_SET = 'backspace',
    WORKOUT_BEGIN = 'directions_run',
    WORKOUT_RESUME = 'replay',

    // Design Elements
    MENU = 'menu',
    MENU_VERTICAL = 'more_vert',
    WEB = 'language',
    CODE = 'code',
    STOPWATCH = 'timer',
    READY = 'recommend',
    LOCK = 'lock',
    PREVIOUS = 'undo',
    CALENDAR_CLEAR = 'event_busy',
    CALENDAR_CHECK = 'event_available',
    CALENDAR_DATE = 'event',
    OPTIONS = 'tune',
    CLOCK = 'access_time',
    EMPTY = 'check_box_outline_blank',

    // Exercise Data
    REPS = 'tag',
    WEIGHT = 'fitness_center',
    DISTANCE = 'pin_drop',
    DURATION = 'schedule',
    WATTS = 'bolt',
    SPEED = 'speed',
    RESISTANCE = 'width_normal',
    INCLINE = 'show_chart',
    CALORIES = 'local_fire_department',
}
*/
