import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphNodeIconComponentProps } from "./node-icon";
export declare type GraphEventFunc<T> = (event: React.MouseEvent, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => void;
export declare type ViewProps<T> = {
    component?: React.ComponentType<GraphNodeIconComponentProps<T>>;
    onNodeMouseEnter?: GraphEventFunc<T>;
    onNodeMouseLeave?: GraphEventFunc<T>;
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onNodeClick?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};
export declare type DataProps<T> = {
    node: IMatrixNode<T>;
    incomes: IMatrixNode<T>[];
};
export declare class GraphElement<T> extends React.Component<DataProps<T> & ViewProps<T>> {
    getLineToIncome(cellSize: number, padding: number, node: IMatrixNode<T>, income: IMatrixNode<T>): {
        node: IMatrixNode<T>;
        income: IMatrixNode<T>;
        line: number[];
    };
    getLines(cellSize: number, padding: number, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]): {
        node: IMatrixNode<T>;
        income: IMatrixNode<T>;
        line: number[];
    }[];
    getCoords(cellSize: number, padding: number, node: IMatrixNode<T>): number[];
    getSize(cellSize: number, padding: number): number;
    wrapEventHandler: (cb: GraphEventFunc<T>, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => (e: React.MouseEvent<Element, MouseEvent>) => void;
    getNodeHandlers(): {
        [eventName: string]: (e: React.MouseEvent) => void;
    };
    renderNode(): false | JSX.Element;
    getLineHandlers(node: IMatrixNode<T>, income: IMatrixNode<T>): {
        [eventName: string]: (e: React.MouseEvent) => void;
    };
    renderLines(): JSX.Element[];
    render(): JSX.Element;
}
