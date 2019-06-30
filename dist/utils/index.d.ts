import { AnchorMargin, INodeOutput } from "../core";
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
