import { TableEnum, TagEnum } from '@/shared/enums'
import type { IdType, NameType, TextAreaType, TimestampType } from '@/shared/types'
import { createId } from '@/shared/utils'
import type ExampleResult from './ExampleResult'

/**
 * `Example` parent model.
 */
export default class Example {
    id: IdType
    createdAt: TimestampType
    tags: TagEnum[]
    name: NameType
    desc: TextAreaType
    lastChild?: ExampleResult

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
        lastChild?: ExampleResult
    }) {
        this.id = id ?? createId(TableEnum.EXAMPLES)
        this.createdAt = createdAt ?? Date.now()
        this.tags = tags ?? [TagEnum.ENABLED]
        this.name = name ?? 'My Example'
        this.desc = desc ?? ''
        this.lastChild = lastChild ?? undefined
    }
}
