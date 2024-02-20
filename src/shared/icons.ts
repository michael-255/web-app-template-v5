import { matFilterAlt, matStar, matStarBorder } from '@quasar/extras/material-icons'
import {
    symRoundedAdd,
    symRoundedAddCircle,
    symRoundedArrowForward,
    symRoundedAssignment,
    symRoundedBugReport,
    symRoundedClose,
    symRoundedCode,
    symRoundedDataObject,
    symRoundedDatabase,
    symRoundedDelete,
    symRoundedDeleteForever,
    symRoundedDeleteSweep,
    symRoundedDownload,
    symRoundedEdit,
    symRoundedError,
    symRoundedFeatureSearch,
    symRoundedFitnessCenter,
    symRoundedInfo,
    symRoundedKeyboardArrowDown,
    symRoundedKeyboardArrowUp,
    symRoundedLanguage,
    symRoundedManageSearch,
    symRoundedMonitoring,
    symRoundedMoreVert,
    symRoundedRedeem,
    symRoundedSearch,
    symRoundedSettings,
    symRoundedSettingsApplications,
    symRoundedSmartToy,
    symRoundedStat2,
    symRoundedStickyNote2,
    symRoundedStraighten,
    symRoundedTune,
    symRoundedUpload,
    symRoundedWarning,
} from '@quasar/extras/material-symbols-rounded'

/**
 * Use `string` as the expected type for Icons.
 * @see https://fonts.google.com/icons
 * @see https://quasar.dev/vue-components/icon#import-guide
 */

// Log Levels (Severity)
export const debugIcon = symRoundedBugReport
export const infoIcon = symRoundedInfo
export const warnIcon = symRoundedWarning
export const errorIcon = symRoundedError

// Pages (Views)
export const donatePageIcon = symRoundedRedeem
export const settingsPageIcon = symRoundedSettings
export const examplesPageIcon = symRoundedSmartToy

// Tables
export const logsTableIcon = symRoundedFeatureSearch
export const settingsTableIcon = symRoundedSettingsApplications
export const parentTableIcon = symRoundedDataObject
export const dataTableIcon = symRoundedDatabase

// Actions Types
export const topOfPageIcon = symRoundedStat2
export const searchIcon = symRoundedSearch
export const inspectIcon = symRoundedManageSearch
export const upIcon = symRoundedKeyboardArrowUp
export const downIcon = symRoundedKeyboardArrowDown
export const backIcon = symRoundedArrowForward
export const closeIcon = symRoundedClose
export const addIcon = symRoundedAdd
export const createIcon = symRoundedAddCircle
export const editIcon = symRoundedEdit
export const importFileIcon = symRoundedUpload
export const exportFileIcon = symRoundedDownload
export const deleteIcon = symRoundedDelete
export const deleteXIcon = symRoundedDeleteForever
export const deleteSweepIcon = symRoundedDeleteSweep
export const favoriteOnIcon = matStar
export const favoriteOffIcon = matStarBorder
export const chartsIcon = symRoundedMonitoring

// Design Elements
export const verticalDotMenuIcon = symRoundedMoreVert
export const filterIcon = matFilterAlt
export const optionsIcon = symRoundedTune
export const databaseIcon = symRoundedDatabase
export const codeIcon = symRoundedCode
export const webIcon = symRoundedLanguage
export const noteIcon = symRoundedStickyNote2

// Fitness (For Reference)
export const workoutIcon = symRoundedAssignment
export const exerciseIcon = symRoundedFitnessCenter
export const metricIcon = symRoundedStraighten

// TODO - Remove this when your ready
/*
// Dialogs
CHARTS = 'bar_chart'
INSPECT = 'manage_search'
NOTE = 'sticky_note_2'

// Tables Types
PARENTS = 'table_chart'
CHILDREN = 'fact_check'
WORKOUTS = 'assignment'
EXERCISES = 'fitness_center'
MEASUREMENTS = 'straighten'

// Actions
BACK = 'arrow_back'
FAVORITE_ON = 'star'
FAVORITE_OFF = 'star_border'
REFRESH = 'refresh'
CLEAR = 'delete_sweep'
CLOSE = 'close'
CREATE = 'add_circle'
DELETE = 'delete'
EDIT = 'edit'
UP = 'keyboard_arrow_up'
ATTACH = 'post_add'
CANCEL = 'cancel'
ADD = 'add'
REMOVE = 'remove'
SAVE = 'save'
DEFAULTS = 'playlist_add'
REMOVE_SET = 'backspace'
WORKOUT_BEGIN = 'directions_run'
WORKOUT_RESUME = 'replay'

// Design Elements
MENU = 'menu'
MENU_VERTICAL = 'more_vert'
WEB = 'language'
CODE = 'code'
STOPWATCH = 'timer'
READY = 'recommend'
LOCK = 'lock'
PREVIOUS = 'undo'
CALENDAR_CLEAR = 'event_busy'
CALENDAR_CHECK = 'event_available'
CALENDAR_DATE = 'event'
OPTIONS = 'tune'
CLOCK = 'access_time'
EMPTY = 'check_box_outline_blank'

// Exercise Data
REPS = 'tag'
WEIGHT = 'fitness_center'
DISTANCE = 'pin_drop'
DURATION = 'schedule'
WATTS = 'bolt'
SPEED = 'speed'
RESISTANCE = 'width_normal'
INCLINE = 'show_chart'
CALORIES = 'local_fire_department'
*/
