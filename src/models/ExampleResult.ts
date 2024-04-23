import Child from '@/models/_Child'
import { createId } from '@/shared/db-utils'
import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, TextAreaType, TimestampType } from '@/shared/types'

export default class ExampleResult extends Child {
    // No additional props yet

    constructor({
        id,
        createdAt,
        parentId,
        note,
        tags,
    }: {
        id?: IdType
        createdAt?: TimestampType
        parentId: IdType
        note?: TextAreaType
        tags?: TagEnum[]
    }) {
        super({
            id: id ?? createId(TableEnum.EXAMPLE_RESULTS),
            createdAt: createdAt ?? Date.now(),
            parentId,
            note: note ?? '',
            tags: tags ?? [],
        })
    }
}
