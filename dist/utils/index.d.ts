export declare enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}
export declare const getVectorDirection: (x1: number, y1: number, x2: number, y2: number) => VectorDirection;
export declare const getCellCenter: (cellSize: number, cellX: number, cellY: number) => number[];
export declare const getCellEntry: (direction: VectorDirection, cellSize: number, padding: number, cellX: number, cellY: number) => number[];
