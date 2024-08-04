import DialogCharts from '@/components/dialogs/DialogCharts.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import ExampleResult from '@/models/ExampleResult'
import { Database } from '@/services/db'
import { SettingKeyEnum, TableEnum, TagEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import { exampleResultSchema } from '@/shared/schemas'
import type { ExampleResultType, IdType } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { liveQuery, type Observable } from 'dexie'
import { extend, useQuasar } from 'quasar'
import useDialogs from './useDialogs'
import useLogger from './useLogger'

export default function useExampleResults(db: Database) {
    const $q = useQuasar()
    const { log } = useLogger(db)
    const dialogs = useDialogs(db)
    const settingsStore = useSettingsStore()
    const selectedStore = useSelectedStore()

    const labelSingular = 'Example Result'
    const labelPlural = 'Example Results'

    function onChartsDialog() {
        console.log('onChartsDialog')
        dialogs.showDialog({ component: DialogCharts })
    }

    async function onInspectDialog(id: IdType) {
        // Making deep copies to avoid FE reactivity issues with proxies
        extend(true, selectedStore.exampleResult, await get(id))
        dialogs.showDialog({ component: DialogInspect })
    }

    function onCreateDialog(parentId: IdType) {
        selectedStore.exampleResult = new ExampleResult({ parentId })
        dialogs.showDialog({ component: DialogCreate })
    }

    async function onEditDialog(id: IdType) {
        // Making deep copies to avoid frontend reactivity issues with proxies
        extend(true, selectedStore.exampleResult, await get(id))
        dialogs.showDialog({ component: DialogEdit })
    }

    function onDeleteDialog(id: IdType) {
        const title = 'Delete Example Result'
        const message = `Are you sure you want to delete ${id}?`
        const color = 'negative'
        const icon = deleteIcon

        if (settingsStore.getSettingValue(SettingKeyEnum.ADVANCED_MODE)) {
            return dialogs.onConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await deleteDialog(id)
                },
            })
        } else {
            dialogs.onStrictConfirmDialog({
                title,
                message,
                color,
                icon,
                onOk: async () => {
                    return await deleteDialog(id)
                },
            })
        }
    }

    async function deleteDialog(id: IdType) {
        try {
            $q.loading.show()
            const deletedExample = await remove(id)
            log.info(`Deleted Example Result`, deletedExample)
        } catch (error) {
            log.error(`Error deleting Example Result`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    /**
     * Returns Examples live query ordered by creation date.
     */
    function liveObservable(): Observable<ExampleResultType[]> {
        return liveQuery(() =>
            db.table(TableEnum.EXAMPLE_RESULTS).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns Example Result by ID.
     */
    async function get(id: IdType): Promise<ExampleResultType> {
        const exampleResult = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        if (!exampleResult) {
            throw new Error(`Example Result ID not found: ${id}`)
        }
        return exampleResult
    }

    /**
     * Imports Example Results into the database using put and returns invalid Example Results.
     */
    async function importData(
        examplesResults: ExampleResultType[],
    ): Promise<Partial<ExampleResultType>[]> {
        const validExamplesResults: ExampleResultType[] = []
        const invalidExamplesResults: Partial<ExampleResultType>[] = []

        // Validate each Example Result
        examplesResults.forEach((e) => {
            if (exampleResultSchema.safeParse(e).success) {
                validExamplesResults.push(exampleResultSchema.parse(e)) // Clean record with parse
            } else {
                invalidExamplesResults.push(e)
            }
        })

        // Put validated Example Result into the database
        await Promise.all(
            validExamplesResults.map((e) => db.table(TableEnum.EXAMPLE_RESULTS).put(e)),
        )

        // Return invalid Example Result for FE error handling
        return invalidExamplesResults
    }

    /**
     * Returns all Example Results sorted by creation date in descending order.
     */
    async function getAll() {
        return await db.table(TableEnum.EXAMPLE_RESULTS).orderBy('createdAt').reverse().toArray()
    }

    /**
     * Creates a new Example Result and updates the parent Example `lastChild` property.
     */
    async function add(exampleResult: ExampleResultType): Promise<ExampleResultType> {
        const validatedExampleResult = exampleResultSchema.parse(exampleResult)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLES).add(validatedExampleResult)
                await updateLastChild(validatedExampleResult.parentId)
            },
        )
        return validatedExampleResult
    }

    /**
     * Removes the child record by id and updates the parent record's `lastChild` property.
     */
    async function remove(id: IdType): Promise<ExampleResultType> {
        const exampleResultsToDelete = await db.table(TableEnum.EXAMPLE_RESULTS).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLE_RESULTS),
            db.table(TableEnum.EXAMPLES),
            async () => {
                await db.table(TableEnum.EXAMPLE_RESULTS).delete(id)
                await updateLastChild(exampleResultsToDelete.parentId)
            },
        )
        return exampleResultsToDelete
    }

    /**
     * From Child:
     *
     * Updates the `lastChild` property of the parent model associated with the `parentId` with the
     * most recently created child model.
     */
    async function updateLastChild(parentId: IdType) {
        const lastChild = (
            await db
                .table(TableEnum.EXAMPLE_RESULTS)
                .where('parentId')
                .equals(parentId)
                .sortBy('createdAt')
        )
            .filter((r) => !r.tags.includes(TagEnum.LOCKED))
            .reverse()[0]

        await db.table(TableEnum.EXAMPLES).update(parentId, { lastChild })
    }

    /**
     * Generates options for select box components on the frontend.
     */
    async function getSelectOptions() {
        const exampleResults = await db
            .table(TableEnum.EXAMPLE_RESULTS)
            .orderBy('createdAt')
            .reverse()
            .toArray()
        return exampleResults.map((e: ExampleResultType) => ({
            value: e.id as IdType,
            label: `${truncateText(e.id, 8, '*')} (${truncateText(e.parentId, 8, '*')})`,
            disable: e.tags.includes(TagEnum.LOCKED) as boolean,
        }))
    }

    return {
        labelSingular,
        labelPlural,
        onChartsDialog,
        onInspectDialog,
        onCreateDialog,
        onEditDialog,
        onDeleteDialog,
        liveObservable,
        importData,
        getAll,
        add,
        remove,
        updateLastChild,
        getSelectOptions,
    }
}
