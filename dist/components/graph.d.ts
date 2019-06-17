import * as React from "react";
import { IMatrixNode } from "../core";
import { ViewProps } from "./element";
export declare type Props<T> = {
    nodesMap: {
        [id: string]: IMatrixNode<T>;
    };
    sellSize: number;
    padding: number;
    widthInCells: number;
    heightInCells: number;
};
interface INodeElementInput<T> {
    node: IMatrixNode<T>;
    incomes: IMatrixNode<T>[];
}
export declare class Graph<T> extends React.Component<Props<T> & ViewProps<T>> {
    getNodeElementInputs: (nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => INodeElementInput<T>[];
    render(): JSX.Element;
}
export {};
