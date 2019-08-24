/**
 * @class DirectGraph
 */
import * as React from "react";
import { INodeInput, IMatrixNode } from "./core";
import { ViewProps } from "./components";
declare type Props<T> = {
    list: INodeInput<T>[];
    cellSize: number;
    padding: number;
};
export { INodeInput, IMatrixNode } from "./core";
export declare type GraphProps<T> = Props<T> & ViewProps<T>;
declare type GraphViewData<T> = {
    nodesMap: {
        [id: string]: IMatrixNode<T>;
    };
    widthInCells: number;
    heightInCells: number;
};
export default class DirectGraph<T> extends React.Component<GraphProps<T>> {
    getNodesMap: (list: INodeInput<T>[]) => GraphViewData<T>;
    render(): JSX.Element;
}
