import { GraphNodeIconComponentProps } from "./node-icon";
import { INodeInput } from "../core";
import * as React from "react";
export declare class DefaultNodeIcon<T> extends React.Component<GraphNodeIconComponentProps<T>> {
    getColor(node: INodeInput<T>, incomes: INodeInput<T>[]): string;
    render(): JSX.Element;
}
