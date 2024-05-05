import BaseTable from '@/components/table/BaseTable.vue'
import Setting from '@/models/Setting'
import BaseModelService from '@/services/abstract/BaseModelService'
import { DurationEnum, RouteTableEnum, SettingIdEnum, TableEnum } from '@/shared/enums'
import { settingsTableIcon } from '@/shared/icons'
import { settingSchema } from '@/shared/schemas'
import type {
    IdType,
    ModelComponent,
    ModelType,
    SelectOption,
    SettingValueType,
} from '@/shared/types'
import type { Observable } from 'dexie'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `SettingService` handles database operations with the `Setting` models.
 */
export class SettingService extends BaseModelService {
    private static _instance: SettingService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): SettingService {
        if (!SettingService._instance) {
            SettingService._instance = new SettingService()
        }
        return SettingService._instance
    }

    Model: typeof Setting = Setting
    labelSingular: string = 'Setting'
    labelPlural: string = 'Settings'
    modelSchema: z.ZodSchema<any> = settingSchema
    table: TableEnum = TableEnum.SETTINGS
    routeTable: RouteTableEnum = RouteTableEnum.SETTINGS
    parentTable: TableEnum = null!
    childTable: TableEnum = null!
    tableColumns = [
        this.tableColumn('id', 'Id'),
        this.tableColumn('createdAt', 'Created Date', 'DATE'),
        this.tableColumn('value', 'Value'),
    ]

    /**
     * Imports Settings into the database using put and returns skipped Settings.
     */
    async import(db: Database, records: ModelType[]) {
        const { validRecords, skippedRecords } = this.validate(records)
        await Promise.all(
            validRecords.map((r) => this.put(db, new Setting({ id: r.id, value: r.value }))),
        )
        return skippedRecords
    }

    /**
     * Initializes settings with default values if they do not exist in the database.
     */
    async initSettings(db: Database): Promise<Setting[]> {
        const defaultSettings: {
            [key in SettingIdEnum]: SettingValueType
        } = {
            [SettingIdEnum.ADVANCED_MODE]: false,
            [SettingIdEnum.INSTRUCTIONS_OVERLAY]: true,
            [SettingIdEnum.CONSOLE_LOGS]: false,
            [SettingIdEnum.INFO_MESSAGES]: true,
            [SettingIdEnum.LOG_RETENTION_DURATION]: DurationEnum[DurationEnum['Six Months']],
        }

        const settingids = Object.values(SettingIdEnum)

        const settings = await Promise.all(
            settingids.map(async (id) => {
                const setting = await db.table(TableEnum.SETTINGS).get(id)
                if (setting) {
                    return setting
                } else {
                    return new Setting({
                        id,
                        value: defaultSettings[id],
                    })
                }
            }),
        )

        await Promise.all(settings.map((s) => db.table(TableEnum.SETTINGS).put(s)))
        return settings
    }

    /**
     * Clears all Settings and resets them with defaults.
     */
    async clear(db: Database) {
        await db.table(TableEnum.SETTINGS).clear()
        await this.initSettings(db)
    }

    /**
     * Return component setup for the data table view.
     */
    dataTable(liveRows: ModelType[]): ModelComponent {
        return {
            component: BaseTable,
            props: {
                table: this.table,
                icon: settingsTableIcon,
                liveRows,
                hasColumnFilters: false,
                hasCreate: false,
                hasCharts: false,
                hasInspect: false,
                hasEdit: false,
                hasDelete: false,
                hasActions: false,
            },
        }
    }

    // eslint-disable-next-line
    liveDashboard(db: Database): Observable<any[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    clean(models: ModelType[]): ModelType[] {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    updateLastChild(db: Database, parentId: IdType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    toggleFavorite(db: Database, model: ModelType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    getSelectOptions(db: Database): Promise<SelectOption[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    purgeLogs(db: Database): Promise<number> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    inspectComponents(): ModelComponent[] {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    formComponents(mutation: 'Create' | 'Edit'): ModelComponent[] {
        throw new Error('Not supported on this Service')
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default SettingService.getSingleton()
