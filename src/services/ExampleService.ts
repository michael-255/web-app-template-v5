import BaseInspectItem from '@/components/dialogs/inspect/BaseInspectItem.vue'
import FieldItemCreatedAt from '@/components/forms/FieldItemCreatedAt.vue'
import FieldItemDesc from '@/components/forms/FieldItemDesc.vue'
import FieldItemId from '@/components/forms/FieldItemId.vue'
import FieldItemName from '@/components/forms/FieldItemName.vue'
import FieldItemTags from '@/components/forms/FieldItemTags.vue'
import FormSubmitButton from '@/components/forms/FormSubmitButton.vue'
import BaseTable from '@/components/table/BaseTable.vue'
import Example from '@/models/Example'
import type Setting from '@/models/Setting'
import ParentModelService from '@/services/abstract/ParentModelService'
import { RouteTableEnum, TableEnum } from '@/shared/enums'
import { parentTableIcon } from '@/shared/icons'
import { exampleSchema } from '@/shared/schemas'
import type { ModelComponent, ModelType } from '@/shared/types'
import type { z } from 'zod'
import type { Database } from './db'

/**
 * The `ExampleService` handles database operations with the `Example` models.
 */
export class ExampleService extends ParentModelService {
    private static _instance: ExampleService | null = null

    private constructor() {
        super()
    }

    static getSingleton(): ExampleService {
        if (!ExampleService._instance) {
            ExampleService._instance = new ExampleService()
        }
        return ExampleService._instance
    }

    Model: typeof Example = Example
    labelSingular: string = 'Example'
    labelPlural: string = 'Examples'
    modelSchema: z.ZodSchema<any> = exampleSchema
    table: TableEnum = TableEnum.EXAMPLES
    routeTable: RouteTableEnum = RouteTableEnum.EXAMPLES
    parentTable: TableEnum = null!
    childTable: TableEnum = TableEnum.EXAMPLE_RESULTS
    tableColumns = [
        this.hiddenTableColumn('id'),
        this.tableColumn('id', 'Id', 'UUID'),
        this.tableColumn('createdAt', 'Created Date', 'DATE'),
        this.tableColumn('name', 'Name', 'TEXT'),
        this.tableColumn('desc', 'Description', 'TEXT'),
        this.tableColumn('tags', 'Tags', 'LIST-PRINT'),
        this.tableColumn('lastChildCreatedAt', 'Last Result Date', 'DATE'),
        this.tableColumn('lastChildNote', 'Last Result Note', 'TEXT'),
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
                props: { label: 'Name', field: 'name', format: 'Default' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Description', field: 'desc', format: 'Default' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Tags', field: 'tags', format: 'List' },
            },
            {
                component: BaseInspectItem,
                props: { label: 'Last Example Result', field: 'lastChild', format: 'Object' },
            },
        ]
    }

    formComponents(mutation: 'Create' | 'Edit'): ModelComponent[] {
        return [
            { component: FieldItemId },
            { component: FieldItemCreatedAt },
            { component: FieldItemName },
            { component: FieldItemDesc },
            { component: FieldItemTags, props: { group: this.group } },
            { component: FormSubmitButton, props: { label: `${mutation} Record` } },
        ]
    }

    /**
     * Return component setup for the data table view.
     */
    dataTable(liveRows: ModelType[]): ModelComponent {
        return {
            component: BaseTable,
            props: {
                table: this.table,
                icon: parentTableIcon,
                liveRows,
                hasColumnFilters: true,
                hasCreate: true,
                hasCharts: true,
                hasInspect: true,
                hasEdit: true,
                hasDelete: true,
                hasActions: true,
            },
        }
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
export default ExampleService.getSingleton()
