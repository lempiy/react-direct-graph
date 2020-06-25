import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphNodeIconComponentProps } from "./node-icon";
import { GraphEventFunc, DataProps } from "./element.types";
export declare type ViewProps<T> = {
    component?: React.ComponentType<GraphNodeIconComponentProps<T>>;
    onNodeMouseEnter?: GraphEventFunc<T>;
    onNodeMouseLeave?: GraphEventFunc<T>;
    onNodeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};
export declare class GraphElement<T> extends React.Component<DataProps<T> & ViewProps<T>> {
    getCoords(cellSize: number, padding: number, node: IMatrixNode<T>): number[];
    wrapEventHandler: (cb: GraphEventFunc<T>, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => (e: React.MouseEvent<Element, MouseEvent>) => void;
    diveToNodeIncome: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>;
    checkAnchorRenderIncomes(node: IMatrixNode<T>): void;
    getNodeIncomes: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>[];
    getAllIncomes: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>[];
    getNodeHandlers(): {
        [eventName: string]: (e: React.MouseEvent) => void;
    };
    renderNode(): false | JSX.Element;
    render(): JSX.Element;
}
