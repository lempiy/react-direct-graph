import { AnchorMargin, INodeOutput } from "../core";

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
            var [x] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            var y = cellY * cellSize + padding;
            return [x, y];
        case VectorDirection.Bottom:
            var [x] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            var y = cellY * cellSize + (cellSize - padding);
            return [x, y];
        case VectorDirection.Right:
            var [, y] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            var x = cellX * cellSize + (cellSize - padding);
            return [x, y];
        case VectorDirection.Left:
            var [, y] = getCellCenter(cellSize, padding, cellX, cellY, margin);
            var x = cellX * cellSize + padding;
            return [x, y];
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
