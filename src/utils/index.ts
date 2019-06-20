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
        if (x1 < x2) return VectorDirection.Right
        else return VectorDirection.Left
    } else {
        if (y1 < y2) return VectorDirection.Bottom
        else return VectorDirection.Top
    }
}

export const getCellCenter = (
    cellSize: number,
    cellX: number,
    cellY: number
): number[] => {
    const x = cellX * cellSize + cellSize * 0.5
    const y = cellY * cellSize + cellSize * 0.5
    return [x, y]
}

export const getCellEntry = (
    direction: VectorDirection,
    cellSize: number,
    padding: number,
    cellX: number,
    cellY: number
): number[] => {
    switch (direction) {
        case VectorDirection.Top:
            var [x] = getCellCenter(cellSize, cellX, cellY)
            var y = cellY * cellSize + padding
            return [x, y]
        case VectorDirection.Bottom:
            var [x] = getCellCenter(cellSize, cellX, cellY)
            var y = cellY * cellSize + (cellSize - padding)
            return [x, y]
        case VectorDirection.Right:
            var [, y] = getCellCenter(cellSize, cellX, cellY)
            var x = cellX * cellSize + (cellSize - padding)
            return [x, y]
        case VectorDirection.Left:
            var [, y] = getCellCenter(cellSize, cellX, cellY)
            var x = cellX * cellSize + padding
            return [x, y]
    }
}
