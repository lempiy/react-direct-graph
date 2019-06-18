/**
 * @class DirectGraph
 */
import * as React from "react";
import { INodeInput, IMatrixNode } from "./core";
import { ViewProps } from "./components";
export declare type Props<T> = {
    list: INodeInput<T>[];
    cellSize: number;
    padding: number;
};
declare type GraphViewData<T> = {
    nodesMap: {
        [id: string]: IMatrixNode<T>;
    };
    widthInCells: number;
    heightInCells: number;
};
export default class DirectGraph<T> extends React.Component<Props<T> & ViewProps<T>> {
    getNodesMap: (list: INodeInput<T>[]) => GraphViewData<T>;
    render(): JSX.Element;
}
export {};
