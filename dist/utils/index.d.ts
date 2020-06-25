import { AnchorMargin, IMatrixNode, INodeOutput } from "../core";
import { GraphEventFunc } from "../components/element";
import * as React from "react";
export declare enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}
export declare const getEdgeMargins: <T>(node: INodeOutput<T>, income: INodeOutput<T>) => AnchorMargin[];
export declare const getVectorDirection: (x1: number, y1: number, x2: number, y2: number) => VectorDirection;
export declare const getCellCenter: (cellSize: number, padding: number, cellX: number, cellY: number, margin: AnchorMargin) => number[];
export declare const getCellEntry: (direction: VectorDirection, cellSize: number, padding: number, cellX: number, cellY: number, margin: AnchorMargin) => number[];
export declare function uniqueId(prefix: string): string;
export declare function getSize(cellSize: number, padding: number): number;
export declare function getCoords<T>(cellSize: number, padding: number, node: IMatrixNode<T>): number[];
export declare function checkAnchorRenderIncomes<T>(node: IMatrixNode<T>): void;
export declare const getAllIncomes: <T>(node: IMatrixNode<T>, nodesMap: {
    [id: string]: IMatrixNode<T>;
}) => IMatrixNode<T>[];
export declare const wrapEventHandler: <T>(cb: GraphEventFunc<T>, node: IMatrixNode<T>, incomes: IMatrixNode<T>[]) => (e: React.MouseEvent<Element, MouseEvent>) => void;
