import { createId } from '@/shared/db-utils'
import { TableEnum, TagEnum } from '@/shared/enums'
import type { DBRecordType, IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'

/**
 * @TODO
 */
export default class Example {
    id: IdType
    createdAt: TimestampType
    tags: TagEnum[]
    name: NameType
    desc: TextAreaType
    lastChild?: DBRecordType

    constructor({
        id,
        createdAt,
        tags,
        name,
        desc,
        lastChild,
    }: {
        id?: IdType
        createdAt?: TimestampType
        tags?: TagEnum[]
        name?: NameType
        desc?: TextAreaType
        lastChild?: DBRecordType
    }) {
        this.id = id ?? createId(TableEnum.EXAMPLES)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? [TagEnum.ENABLED]
        this.name = name ?? 'My Example'
        this.desc = desc ?? ''
        this.lastChild = lastChild ?? undefined
    }
}
