/// <reference types="react" />
import { IMatrixNode } from "../core";
export declare type DataProps<T> = {
    node: IMatrixNode<T>;
    nodesMap: {
        [id: string]: IMatrixNode<T>;
    };
};
export declare type GraphEventFunc<T> = (event: React.MouseEvent, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => void;
