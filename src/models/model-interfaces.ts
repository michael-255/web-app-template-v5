import type { TagEnum } from '@/shared/enums'
import type {
    IdType,
    LogDetailsType,
    LogLabelType,
    LogLevelType,
    ModelType,
    NameType,
    SettingValueType,
    TextAreaType,
    TimestampType,
} from '@/shared/types'

interface IId {
    id: IdType
}

interface ICreatedAt {
    createdAt: TimestampType
}

interface ITags {
    tags: TagEnum[]
}

interface IParentModel extends ITags {
    name: NameType
    desc: TextAreaType
    lastChild?: ModelType
}

interface IChildModel extends ITags {
    parentId: IdType
    note: TextAreaType
}

export interface ISetting extends IId {
    value: SettingValueType
}

export interface ILog extends IId, ICreatedAt {
    logLevel: LogLevelType
    label: LogLabelType
    details: LogDetailsType
}

export interface IExample extends IParentModel {
    //
}

export interface IExampleResult extends IChildModel {
    //
}
