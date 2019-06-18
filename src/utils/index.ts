export enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}

export const getVectorDirection = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
): VectorDirection => {
    if (y1 === y2) {
        if (x1 < x2) return VectorDirection.Right;
        else return VectorDirection.Left;
    } else {
        if (y1 < y2) return VectorDirection.Bottom;
        else return VectorDirection.Top;
    }
};

export const getCellCenter = (
    cellSize: number,
    cellX: number,
    cellY: number
): number[] => {
    const x = cellX * cellSize + cellSize * 0.5;
    const y = cellY * cellSize + cellSize * 0.5;
    return [x, y];
};

export const getCellTopEntry = (
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [x] = getCellCenter(cellSize, cellX, cellY);
    const y = cellY * cellSize + padding;
    return [x, y];
};

export const getCellBottomEntry = (
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [x] = getCellCenter(cellSize, cellX, cellY);
    const y = cellY * cellSize + (cellSize - padding);
    return [x, y];
};

export const getCellRightEntry = (
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [, y] = getCellCenter(cellSize, cellX, cellY);
    const x = cellX * cellSize + (cellSize - padding);
    return [x, y];
};

export const getCellLeftEntry = (
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [, y] = getCellCenter(cellSize, cellX, cellY);
    const x = cellX * cellSize + padding;
    return [x, y];
};
