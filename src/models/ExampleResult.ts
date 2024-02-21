import type { ChildModel } from '@/models/model-interfaces'
import {
    booleanSchema,
    exampleResultSchema,
    textAreaSchema,
    timestampSchema,
    uuidSchema,
} from '@/shared/schemas'
import type { BooleanType, TextAreaType, TimestampType, UUIDType } from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { uid, type QTableColumn } from 'quasar'

/**
 * Must include a UUID for the `parentId` property or it will fail
 * - `parentId` = Parent Example Id
 */
export default class ExampleResult implements ChildModel {
    id: UUIDType
    createdAt: TimestampType
    parentId: UUIDType
    note: TextAreaType
    locked: BooleanType
    skipped: BooleanType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        parentId = '', // Fails without UUID
        note = '',
        locked = false,
        skipped = false,
    }: Partial<ExampleResult> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.parentId = uuidSchema.parse(parentId)
        this.note = textAreaSchema.parse(note)
        this.locked = booleanSchema.parse(locked)
        this.skipped = booleanSchema.parse(skipped)
    }

    /**
     * Validate the model using it's Zod schema
     */
    isValid(): boolean {
        return exampleResultSchema.safeParse(this).success
    }

    /**
     * Displayable labels for the model
     */
    static getLabel(style: 'singular' | 'plural') {
        return style === 'singular' ? 'Example Result' : 'Example Results'
    }

    /**
     * @TODO
     */
    static getTableColumns(): QTableColumn[] {
        return [
            hiddenTableColumn('id'),
            tableColumn('id', 'Id', 'UUID'),
            tableColumn('createdAt', 'Created Date', 'DATE'),
            tableColumn('parentId', 'Example Id', 'UUID'), // Parent is Example
            tableColumn('note', 'Note', 'TEXT'),
            tableColumn('locked', 'Locked', 'BOOL'),
            tableColumn('skipped', 'Skipped', 'BOOL'),
        ]
    }

    /**
     * @TODO
     */
    static getInspectionFormat() {
        return [
            {
                property: 'id',
                label: 'Id',
            },
        ]
    }
}
