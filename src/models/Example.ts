import Parent from '@/models/_Parent'
import { createId } from '@/shared/db-utils'
import { TableEnum, TagEnum } from '@/shared/enums'
import type { DBRecordType, IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'

export default class Example extends Parent {
    // No additional props yet

    constructor({
        id,
        createdAt,
        name,
        desc,
        tags,
        lastChild,
    }: {
        id?: IdType
        createdAt?: TimestampType
        name?: NameType
        desc?: TextAreaType
        tags?: TagEnum[]
        lastChild?: DBRecordType
    }) {
        super({
            id: id ?? createId(TableEnum.EXAMPLES),
            createdAt: createdAt ?? Date.now(),
            name: name ?? 'My Example',
            desc: desc ?? '',
            tags: tags ?? [TagEnum.ENABLED],
            lastChild: lastChild ?? undefined,
        })
    }
}
