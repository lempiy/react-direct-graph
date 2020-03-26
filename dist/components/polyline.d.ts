import * as React from "react";
import { IMatrixNode } from "../core";
import { GraphEventFunc, DataProps } from "./element.types";
export declare type ViewProps<T> = {
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};
interface LineBranch<T> {
    node: IMatrixNode<T>;
    income: IMatrixNode<T>;
    line: number[][];
}
export declare class GraphPolyline<T> extends React.Component<DataProps<T> & ViewProps<T>> {
    getPolyline(cellSize: number, padding: number, branch: IMatrixNode<T>[]): number[][];
    getLineToIncome(cellSize: number, padding: number, node: IMatrixNode<T>, income: IMatrixNode<T>): {
        node: IMatrixNode<T>;
        income: IMatrixNode<T>;
        line: number[];
    };
    getLines(cellSize: number, padding: number, node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }): LineBranch<T>[];
    getCoords(cellSize: number, padding: number, node: IMatrixNode<T>): number[];
    getSize(cellSize: number, padding: number): number;
    wrapEventHandler: (cb: GraphEventFunc<T>, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => (e: React.MouseEvent<Element, MouseEvent>) => void;
    diveToNodeIncome: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>;
    getNodeBranches: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>[][];
    getIncomeBranch: (lastIncome: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>[];
    checkAnchorRenderIncomes(node: IMatrixNode<T>): void;
    getAllIncomes: (node: IMatrixNode<T>, nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => IMatrixNode<T>[];
    getLineHandlers(node: IMatrixNode<T>, income: IMatrixNode<T>): {
        [eventName: string]: (e: React.MouseEvent) => void;
    };
    getMarker(markerHash: string, incomeId: string): {
        [key: string]: string;
    };
    getMarkerId(markerHash: string, incomeId: string): string;
    lineName(income: IMatrixNode<T>): JSX.Element;
    renderLines(node: IMatrixNode<T>, lines: LineBranch<T>[]): JSX.Element[];
    render(): 0 | JSX.Element;
}
export {};
