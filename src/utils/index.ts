export enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}

const getXVertexDirection = (x1:number, x2: number): VectorDirection => {
    return x1 < x2 ? VectorDirection.Right : VectorDirection.Left
}

const getYVertexDirection = (y1:number, y2: number): VectorDirection => {
    return y1 < y2 ? VectorDirection.Bottom : VectorDirection.Top
}

export const getVectorDirection = (
    x1: number,
    y1: number,
    x2: number,
    y2: number
): VectorDirection => {
    return y1 === y2 ?
        getXVertexDirection(x1, x2) : 
        getYVertexDirection(y1, y2)
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
