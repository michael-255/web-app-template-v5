import type { IdType, SettingValueType } from '@/shared/types'

export default class Setting {
    constructor(
        public id: IdType,
        public value: SettingValueType,
    ) {}
}
