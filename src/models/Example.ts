import type { ParentModel } from '@/models/model-interfaces'
import {
    booleanSchema,
    exampleSchema,
    nameSchema,
    optionalTimestampSchema,
    tagsSchema,
    textAreaSchema,
    timestampSchema,
    uuidSchema,
} from '@/shared/schemas'
import type {
    BooleanType,
    NameType,
    OptionalTimestampType,
    TagsType,
    TextAreaType,
    TimestampType,
    UUIDType,
} from '@/shared/types'
import { hiddenTableColumn, tableColumn } from '@/shared/utils'
import { uid, type QTableColumn } from 'quasar'

export default class Example implements ParentModel {
    id: UUIDType
    createdAt: TimestampType
    name: NameType
    desc: TextAreaType
    tags: TagsType
    locked: BooleanType
    favorited: BooleanType
    enabled: BooleanType
    lastChildCreatedAt: OptionalTimestampType
    lastChildNote: TextAreaType

    constructor({
        id = uid(),
        createdAt = Date.now(),
        name = 'My Example',
        desc = '',
        tags = [],
        locked = false,
        favorited = false,
        enabled = true,
        lastChildCreatedAt = undefined,
        lastChildNote = '',
    }: Partial<Example> = {}) {
        this.id = uuidSchema.parse(id)
        this.createdAt = timestampSchema.parse(createdAt)
        this.name = nameSchema.parse(name)
        this.desc = textAreaSchema.parse(desc)
        this.tags = tagsSchema.parse(tags)
        this.locked = booleanSchema.parse(locked)
        this.favorited = booleanSchema.parse(favorited)
        this.enabled = booleanSchema.parse(enabled)
        this.lastChildCreatedAt = optionalTimestampSchema.parse(lastChildCreatedAt)
        this.lastChildNote = textAreaSchema.parse(lastChildNote)
    }

    /**
     * Validate the model using it's Zod schema
     */
    isValid(): boolean {
        return exampleSchema.safeParse(this).success
    }

    /**
     * Displayable labels for the model
     */
    static getLabel(style: 'singular' | 'plural'): string {
        return style === 'singular' ? 'Example' : 'Examples'
    }

    /**
     * @TODO
     */
    static getTableColumns(): QTableColumn[] {
        return [
            hiddenTableColumn('id'),
            tableColumn('id', 'Id', 'UUID'),
            tableColumn('createdAt', 'Created Date', 'DATE'),
            tableColumn('name', 'Name', 'TEXT'),
            tableColumn('desc', 'Description', 'TEXT'),
            tableColumn('tags', 'Tags', 'LIST-PRINT'),
            tableColumn('locked', 'Locked', 'BOOL'),
            tableColumn('favorited', 'Favorited', 'BOOL'),
            tableColumn('enabled', 'Enabled', 'BOOL'),
            tableColumn('lastChildCreatedAt', 'Last Result Date', 'DATE'),
            tableColumn('lastChildNote', 'Last Result Note', 'TEXT'),
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
