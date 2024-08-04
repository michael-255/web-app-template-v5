import DialogCharts from '@/components/dialogs/DialogCharts.vue'
import DialogCreate from '@/components/dialogs/DialogCreate.vue'
import DialogEdit from '@/components/dialogs/DialogEdit.vue'
import DialogInspect from '@/components/dialogs/DialogInspect.vue'
import useDialogs from '@/composables/useDialogs'
import Example from '@/models/Example'
import { Database } from '@/services/db'
import { SettingKeyEnum, TableEnum, TagEnum } from '@/shared/enums'
import { deleteIcon } from '@/shared/icons'
import { exampleSchema } from '@/shared/schemas'
import type { ExampleType, IdType, SelectOption } from '@/shared/types'
import { truncateText } from '@/shared/utils'
import useSelectedStore from '@/stores/selected'
import useSettingsStore from '@/stores/settings'
import { liveQuery, type Observable } from 'dexie'
import { extend, useQuasar } from 'quasar'
import useLogger from './useLogger'

export default function useExamples(db: Database) {
    const $q = useQuasar()
    const { log } = useLogger(db)
    const dialogs = useDialogs(db)
    const settingsStore = useSettingsStore()
    const selectedStore = useSelectedStore()

    const labelSingular = 'Example'
    const labelPlural = 'Examples'

    function onChartsDialog() {
        console.log('onChartsDialog')
        dialogs.showDialog({ component: DialogCharts })
    }

    async function onInspectDialog(id: IdType) {
        // Making deep copies to avoid FE reactivity issues with proxies
        extend(true, selectedStore.example, await get(id))
        dialogs.showDialog({ component: DialogInspect })
    }

    function onCreateDialog() {
        selectedStore.example = new Example({})
        dialogs.showDialog({ component: DialogCreate })
    }

    async function onEditDialog(id: IdType) {
        // Making deep copies to avoid frontend reactivity issues with proxies
        extend(true, selectedStore.example, await get(id))
        dialogs.showDialog({ component: DialogEdit })
    }

    function onDeleteDialog(id: IdType) {
        const title = 'Delete Example'
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
            log.info(`Deleted Example`, deletedExample)
        } catch (error) {
            log.error(`Error deleting Example`, error as Error)
        } finally {
            $q.loading.hide()
        }
    }

    /**
     * Returns Examples live query with records that are not enabled filtered out and the remaining
     * sorted alphabetically by name with favorited records given priority.
     */
    function liveDashboardObservable(): Observable<ExampleType[]> {
        return liveQuery(() =>
            db
                .table(TableEnum.EXAMPLES)
                .orderBy('name')
                .filter((r) => r.tags.includes(TagEnum.ENABLED))
                .toArray()
                .then((records) =>
                    records.sort((a, b) => {
                        const aIsFavorited = a.tags.includes(TagEnum.FAVORITED)
                        const bIsFavorited = b.tags.includes(TagEnum.FAVORITED)

                        if (aIsFavorited && !bIsFavorited) {
                            return -1 // a comes first
                        } else if (!aIsFavorited && bIsFavorited) {
                            return 1 // b comes first
                        } else {
                            // If both or neither are favorited, sort alphabetically by name
                            return a.name.localeCompare(b.name)
                        }
                    }),
                ),
        )
    }

    /**
     * Returns Examples live query ordered by creation date.
     */
    function liveObservable(): Observable<ExampleType[]> {
        return liveQuery(() =>
            db.table(TableEnum.EXAMPLES).orderBy('createdAt').reverse().toArray(),
        )
    }

    /**
     * Returns Example by ID.
     */
    async function get(id: IdType): Promise<ExampleType> {
        const modelToGet = await db.table(TableEnum.EXAMPLES).get(id)
        if (!modelToGet) {
            throw new Error(`Example ID not found: ${id}`)
        }
        return modelToGet!
    }

    /**
     * Creates a new Example in the database.
     */
    async function add(example: ExampleType): Promise<ExampleType> {
        const validatedExample = exampleSchema.parse(example)
        await db.table(TableEnum.EXAMPLES).add(validatedExample)
        return validatedExample
    }

    /**
     * Removes the Example by id and all associated child records from the database.
     */
    async function remove(id: IdType): Promise<ExampleType> {
        const exampleToDelete = await db.table(TableEnum.EXAMPLES).get(id)
        await db.transaction(
            'rw',
            db.table(TableEnum.EXAMPLES),
            db.table(TableEnum.EXAMPLE_RESULTS),
            async () => {
                await db.table(TableEnum.EXAMPLES).delete(id)
                await db.table(TableEnum.EXAMPLE_RESULTS).where('parentId').equals(id).delete()
            },
        )
        return exampleToDelete
    }

    /**
     * Imports Examples into the database using put and returns invalid Examples.
     */
    async function importData(examples: ExampleType[]): Promise<Partial<ExampleType>[]> {
        const validExamples: ExampleType[] = []
        const invalidExamples: Partial<ExampleType>[] = []

        // Validate each Example
        examples.forEach((e) => {
            if (exampleSchema.safeParse(e).success) {
                validExamples.push(exampleSchema.parse(e)) // Clean record with parse
            } else {
                invalidExamples.push(e)
            }
        })

        // Put validated Examples into the database
        await Promise.all(validExamples.map((e) => db.table(TableEnum.EXAMPLES).put(e)))

        // Return invalid Examples for FE error handling
        return invalidExamples
    }

    /**
     * Custom export operation for fetching all Examples from the database with unneeded fields
     * removed.
     */
    async function exportData() {
        const examples = await db.table(TableEnum.EXAMPLES).toArray()
        return examples.map((e) => {
            if ('lastChild' in e) {
                delete e.lastChild
            }
            return e
        })
    }

    /**
     * From Parent:
     *
     * Updates the `lastChild` property of the Example associated with the `parentId` with the
     * most recently created child record.
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
     * Toggles the favorited tag on the Example's tags property.
     */
    async function toggleFavorite(example: ExampleType) {
        const index = example.tags.indexOf(TagEnum.FAVORITED)
        if (index === -1) {
            example.tags.push(TagEnum.FAVORITED)
        } else {
            example.tags.splice(index, 1)
        }
        await db.table(TableEnum.EXAMPLES).update(example.id, { tags: example.tags })
    }

    /**
     * Generates an options list of Examples for select box components on the FE.
     */
    async function getSelectOptions(): Promise<SelectOption[]> {
        const examples = await db.table(TableEnum.EXAMPLES).orderBy('name').toArray()
        return examples.map((e: ExampleType) => ({
            value: e.id as IdType,
            label: `${e.name} (${truncateText(e.id, 8, '*')})`,
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
        liveDashboardObservable,
        liveObservable,
        get,
        add,
        remove,
        importData,
        exportData,
        updateLastChild,
        toggleFavorite,
        getSelectOptions,
    }
}
