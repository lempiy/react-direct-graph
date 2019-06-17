export declare enum VectorDirection {
    Top = "top",
    Bottom = "bottom",
    Right = "right",
    Left = "left"
}
export declare const getVectorDirection: (x1: number, y1: number, x2: number, y2: number) => VectorDirection;
export declare const getCellCenter: (sellSize: number, cellX: number, cellY: number) => number[];
export declare const getCellTopEntry: (sellSize: number, padding: number, cellX: number, cellY: number) => number[];
export declare const getCellBottomEntry: (sellSize: number, padding: number, cellX: number, cellY: number) => number[];
export declare const getCellRightEntry: (sellSize: number, padding: number, cellX: number, cellY: number) => number[];
export declare const getCellLeftEntry: (sellSize: number, padding: number, cellX: number, cellY: number) => number[];
