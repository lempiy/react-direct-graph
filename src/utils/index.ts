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
    sellSize: number,
    cellX: number,
    cellY: number
): number[] => {
    const x = cellX * sellSize + sellSize * 0.5;
    const y = cellY * sellSize + sellSize * 0.5;
    return [x, y];
};

export const getCellTopEntry = (
    sellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [x] = getCellCenter(sellSize, cellX, cellY);
    const y = cellY * sellSize + padding;
    return [x, y];
};

export const getCellBottomEntry = (
    sellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [x] = getCellCenter(sellSize, cellX, cellY);
    const y = cellY * sellSize + (sellSize - padding);
    return [x, y];
};

export const getCellRightEntry = (
    sellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [, y] = getCellCenter(sellSize, cellX, cellY);
    const x = cellX * sellSize + (sellSize - padding);
    return [x, y];
};

export const getCellLeftEntry = (
    sellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    const [, y] = getCellCenter(sellSize, cellX, cellY);
    const x = cellX * sellSize + padding;
    return [x, y];
};
