import * as React from "react";
import { GraphEventFunc } from "../element";
import { IMatrixNode } from "../../core";
import { VectorDirection } from "../../utils";

export type ViewProps<T> = {
    edgeComponent?: React.ComponentType<T>;
    onEdgeMouseEnter?: GraphEventFunc<T>;
    onEdgeMouseLeave?: GraphEventFunc<T>;
    onEdgeClick?: GraphEventFunc<T>;
    cellSize: number;
    padding: number;
};

export interface LineBranch<T> {
    node: IMatrixNode<T>;
    income: IMatrixNode<T>;
    line: number[][];
}

export const pointResolversMap: { [key in VectorDirection]: VectorDirection[] } = {
    [VectorDirection.Top]: [VectorDirection.Top, VectorDirection.Bottom],
    [VectorDirection.Bottom]: [VectorDirection.Bottom, VectorDirection.Top],
    [VectorDirection.Right]: [VectorDirection.Right, VectorDirection.Left],
    [VectorDirection.Left]: [VectorDirection.Left, VectorDirection.Right]
};
