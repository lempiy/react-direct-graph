import * as React from "react";
import { IMatrixNode } from "../core";
import { ViewProps as ElementViewProps } from "./element";
import { ViewProps as PolylineViewProps } from "./polyline";
export declare type Props<T> = {
    nodesMap: {
        [id: string]: IMatrixNode<T>;
    };
    cellSize: number;
    padding: number;
    widthInCells: number;
    heightInCells: number;
};
export declare type ViewProps<T> = ElementViewProps<T> & PolylineViewProps<T>;
interface INodeElementInput<T> {
    node: IMatrixNode<T>;
}
export declare class Graph<T> extends React.Component<ViewProps<T> & Props<T>> {
    getNodeElementInputs: (nodesMap: {
        [id: string]: IMatrixNode<T>;
    }) => INodeElementInput<T>[];
    renderElements(): JSX.Element[];
    render(): JSX.Element;
}
export {};
