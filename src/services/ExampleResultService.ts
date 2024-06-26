import BaseInspectItem from '@/components/dialogs/inspect/BaseInspectItem.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemNote from '@/components/forms/FieldItemNote.vue'
import FieldItemParentId from '@/components/forms/FieldItemParentId.vue'
import FieldItemTags from '@/components/forms/FieldItemTags.vue'
import FormSubmitButton from '@/components/forms/FormSubmitButton.vue'
import ExampleResult from '@/models/ExampleResult'
import type Setting from '@/models/Setting'
import ChildModelService from '@/services/abstract/ChildModelService'
import { RouteTableEnum, TableEnum } from '@/shared/enums'
import { databaseIcon } from '@/shared/icons'
import { exampleResultSchema } from '@/shared/schemas'
import type { ModelComponent, ModelType } from '@/shared/types'
import type { Observable } from 'dexie'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `ExampleResultService` handles database operations with the `ExampleResult` models.
 */
export class ExampleResultService extends ChildModelService {
    private static _instance: ExampleResultService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): ExampleResultService {
        if (!ExampleResultService._instance) {
            ExampleResultService._instance = new ExampleResultService()
        }
        return ExampleResultService._instance
    }

    Model: typeof ExampleResult = ExampleResult
    labelSingular: string = 'Example Result'
    labelPlural: string = 'Example Results'
    modelSchema: z.ZodSchema<any> = exampleResultSchema
    table: TableEnum = TableEnum.EXAMPLE_RESULTS
    routeTable: RouteTableEnum = RouteTableEnum.EXAMPLE_RESULTS
    parentTable: TableEnum = TableEnum.EXAMPLES
    childTable: TableEnum = null!
    icon: string = databaseIcon
    supportsColumnFilters: boolean = true
    supportsCreate: boolean = true
    supportsCharts: boolean = true
    supportsInspect: boolean = true
    supportsEdit: boolean = true
    supportsDelete: boolean = true
    supportsActions: boolean = true
    tableColumns = [
        this.hiddenTableColumn('id'),
        this.tableColumn('id', 'Id', 'UUID'),
        this.tableColumn('createdAt', 'Created Date', 'DATE'),
        this.tableColumn('parentId', 'Parent Example Id', 'UUID'), // Parent is Example
        this.tableColumn('note', 'Note', 'TEXT'),
        this.tableColumn('tags', 'Tags', 'LIST-PRINT'),
    ]

    /**
     * Return components setup for inspecting this model.
     */
    inspectComponents(): ModelComponent[] {
        return [
            { component: BaseInspectItem, props: { label: 'Id', field: 'id', format: 'Default' } },
            {
                component: BaseInspectItem,
                props: { label: 'Created Date', field: 'createdAt', format: 'Date' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Parent Example Id', field: 'parentId', format: 'Default' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Note', field: 'note', format: 'Default' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Tags', field: 'tags', format: 'List' },
            },
        ]
    }

    formComponents(mutation: 'Create' | 'Edit'): ModelComponent[] {
        return [
            { component: FieldItemId },
            { component: FieldItemParentId, props: { mutation, table: this.table } },
            { component: FieldItemCreatedAt },
            { component: FieldItemNote },
            { component: FieldItemTags, props: { group: this.group } },
            { component: FormSubmitButton, props: { label: `${mutation} Record` } },
        ]
    }

    // eslint-disable-next-line
    liveDashboard(db: Database): Observable<ModelType[]> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    clean(models: ModelType[]): ModelType[] {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    toggleFavorite(db: Database, model: ModelType): Promise<void> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    purgeLogs(db: Database): Promise<number> {
        throw new Error('Not supported on this Service')
    }

    // eslint-disable-next-line
    initSettings(db: Database): Promise<Setting[]> {
        throw new Error('Not supported on this Service')
    }
}

/**
 * Singleton instance exported as default for convenience.
 */
export default ExampleResultService.getSingleton()
