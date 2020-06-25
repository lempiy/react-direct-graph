import {AnchorMargin, IMatrixNode, INodeOutput} from "../core";
import {GraphEventFunc} from "../components/element";
import * as React from "react";

export enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}

const getXVertexDirection = (x1: number, x2: number): VectorDirection => {
    return x1 < x2 ? VectorDirection.Right : VectorDirection.Left;
};

const getYVertexDirection = (y1: number, y2: number): VectorDirection => {
    return y1 < y2 ? VectorDirection.Bottom : VectorDirection.Top;
};

export const getEdgeMargins = <T>(
    node: INodeOutput<T>,
    income: INodeOutput<T>
): AnchorMargin[] => {
    let result = [AnchorMargin.None, AnchorMargin.None];
    switch (true) {
        case node.isAnchor && income.isAnchor:
            result = [
                node.anchorMargin as AnchorMargin,
                income.anchorMargin as AnchorMargin
            ];
            break;
        case node.isAnchor:
            result = [
                node.anchorMargin as AnchorMargin,
                node.anchorMargin as AnchorMargin
            ];
            break;
        case income.isAnchor:
            result = [
                income.anchorMargin as AnchorMargin,
                income.anchorMargin as AnchorMargin
            ];
            break;
    }
    return result;
};

export const getVectorDirection = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
): VectorDirection => {
    return y1 === y2
        ? getXVertexDirection(x1, x2)
        : getYVertexDirection(y1, y2);
};

const getMargin = (
    margin: AnchorMargin,
    padding: number,
    cellSize: number
): number => {
    if (margin === AnchorMargin.None) return 0;
    const size = Math.round((cellSize - padding * 2) * 0.15);
    return margin === AnchorMargin.Left ? -size : size;
};

export const getCellCenter = (
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number,
    margin: AnchorMargin
): number[] => {
    const outset = getMargin(margin, padding, cellSize);
    const x = cellX * cellSize + cellSize * 0.5 + outset;
    const y = cellY * cellSize + cellSize * 0.5;
    return [x, y];
};

export const getCellEntry = (
    direction: VectorDirection,
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number,
    margin: AnchorMargin
): number[] => {
    switch (direction) {
        case VectorDirection.Top:
            const [xTop] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            const yTop = cellY * cellSize + padding;
            return [xTop, yTop];
        case VectorDirection.Bottom:
            const [xBottom] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            const yBottom = cellY * cellSize + (cellSize - padding);
            return [xBottom, yBottom];
        case VectorDirection.Right:
            const [, yRight] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            const xRight = cellX * cellSize + (cellSize - padding);
            return [xRight, yRight];
        case VectorDirection.Left:
            const [, yLeft] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            const xLeft = cellX * cellSize + padding;
            return [xLeft, yLeft];
    }
};

function gen4(): string {
    return Math.random()
        .toString(16)
        .slice(-4);
}

export function uniqueId(prefix: string): string {
    return (prefix || "").concat([gen4(), gen4(), gen4(), gen4()].join("-"));
}

export function getSize(cellSize: number, padding: number): number {
    return cellSize - padding * 2;
}

export function getCoords<T>(
    cellSize: number,
    padding: number,
    node: IMatrixNode<T>
): number[] {
    return [node.x * cellSize + padding, node.y * cellSize + padding];
}

export function checkAnchorRenderIncomes<T>(node: IMatrixNode<T>) {
    if (node.renderIncomes.length != 1)
        throw new Error(
            `Anchor has non 1 income: ${
                node.id
            }. Incomes ${node.renderIncomes.join(",")}`
        );
}

export const getAllIncomes = <T>(
    node: IMatrixNode<T>,
    nodesMap: { [id: string]: IMatrixNode<T> }
): IMatrixNode<T>[] => node.renderIncomes.map(id => nodesMap[id]);

export const wrapEventHandler = <T>(
    cb: GraphEventFunc<T>,
    node: IMatrixNode<T>,
    incomes: IMatrixNode<T>[]
): ((e: React.MouseEvent) => void) => (e: React.MouseEvent) => cb(e, node, incomes);
