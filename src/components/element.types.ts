import { IMatrixNode } from "../core";
export type DataProps<T> = {
    node: IMatrixNode<T>;
    nodesMap: { [id: string]: IMatrixNode<T> };
};

export type GraphEventFunc<T> = (
    event: React.MouseEvent,
    node: IMatrixNode<T>,
    incomes: IMatrixNode<T>[]
) => void;
