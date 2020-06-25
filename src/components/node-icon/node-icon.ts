import { INodeInput } from "../../core"

export type GraphNodeIconComponentProps<T> = {
    node: INodeInput<T>
    incomes: INodeInput<T>[]
}
